#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

BASE_URL = "https://www.automobiledimension.com/"
DEFAULT_TIMEOUT_SECONDS = 30

TOP_MODEL_RE = re.compile(
    r"\{\s*id: \"(?P<id>[^\"]+)\",\s*brand: \"(?P<brand>[^\"]+)\",\s*model: \"(?P<model>[^\"]+)\",\s*salesRank12m: (?P<rank>\d+),\s*salesUnits12m: (?P<units>\d+),\s*\}",
    re.S,
)
METADATA_KEY_RE = re.compile(r'^\s*"(?P<id>[^"]+)": \{$', re.M)
BRAND_OPTION_RE = re.compile(r'<option value="(?P<path>/[^\"]+-car-dimensions\.html)">(?P<brand>[^<]+)</option>', re.I)
UNIT_BLOCK_RE = re.compile(r'<div class="unit">(?P<block>.*?)</div>\s*(?=(?:<div class="unit">|</section>))', re.S)

BODY_TYPE_BY_CATEGORY_PATH = {
    "city-cars.php": "utilitario",
    "small-cars.php": "utilitario",
    "compact-cars.php": "compacto",
    "family-cars.php": "compacto",
    "small-suv.php": "suv-urbano",
    "compact-suv.php": "suv-compacto",
    "mid-size-suv.php": "suv-compacto",
    "large-suv-4x4-cars.php": "suv-compacto",
}

BODY_TYPE_BY_CATEGORY_TEXT = {
    "city cars": "utilitario",
    "small cars": "utilitario",
    "compact cars": "compacto",
    "family cars": "compacto",
    "small suv": "suv-urbano",
    "compact suv": "suv-compacto",
    "mid-size suv": "suv-compacto",
    "large suv and 4x4": "suv-compacto",
}

MATCH_STOPWORDS = {
    "ALLURE",
    "GASOLINA",
    "HYBRID",
    "HYBR",
    "PHEV",
    "HEV",
    "MHEV",
    "E",
    "TECH",
    "ETECH",
    "ELECT",
    "ELECTRIC",
    "EDITION",
    "GS",
    "XHL",
    "MT",
    "MT6",
    "CV",
    "D",
    "DE",
    "DMI",
    "DM",
    "I",
    "NUEVO",
    "NUEVA",
    "NEW",
    "SPORTBACK",
    "4MATIC",
    "SDRIVE20D",
}


@dataclass(frozen=True)
class TopModel:
    id: str
    brand: str
    model: str
    sales_rank_12m: int
    sales_units_12m: int


@dataclass(frozen=True)
class BrandModelCandidate:
    title: str
    model_url: str
    image_url: str | None
    length_mm: int | None
    width_mm: int | None
    trunk_liters: int | None


def strip_accents(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    return "".join(char for char in normalized if unicodedata.category(char) != "Mn")


def normalize_text(value: str) -> str:
    text = strip_accents(value).upper()
    text = re.sub(r"([A-Z])([0-9])", r"\1 \2", text)
    text = re.sub(r"([0-9])([A-Z])", r"\1 \2", text)
    text = text.replace("&", " ")
    text = re.sub(r"[^A-Z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokenize(value: str) -> list[str]:
    return [token for token in normalize_text(value).split(" ") if token]


def normalize_brand(value: str) -> str:
    return normalize_text(value)


def parse_top_models(ts_path: Path) -> list[TopModel]:
    source = ts_path.read_text(encoding="utf-8")
    models: list[TopModel] = []
    for match in TOP_MODEL_RE.finditer(source):
        models.append(
            TopModel(
                id=match.group("id"),
                brand=match.group("brand"),
                model=match.group("model"),
                sales_rank_12m=int(match.group("rank")),
                sales_units_12m=int(match.group("units")),
            )
        )
    return models


def parse_metadata_ids(ts_path: Path) -> set[str]:
    if not ts_path.exists():
        return set()
    source = ts_path.read_text(encoding="utf-8")
    return {match.group("id") for match in METADATA_KEY_RE.finditer(source)}


def fetch_text(url: str, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS, retries: int = 2) -> str:
    request = Request(url, headers={"User-Agent": "CodexCarMetadata/1.0"})
    last_error: Exception | None = None
    for _ in range(retries + 1):
        try:
            with urlopen(request, timeout=timeout_seconds) as response:
                return response.read().decode("utf-8", errors="ignore")
        except (HTTPError, URLError, TimeoutError) as exc:
            last_error = exc
    if last_error is None:
        raise RuntimeError(f"Failed to fetch {url}")
    raise last_error


def build_brand_page_map(home_html: str) -> dict[str, str]:
    brand_map: dict[str, str] = {}
    for match in BRAND_OPTION_RE.finditer(home_html):
        brand = html.unescape(match.group("brand"))
        path = match.group("path")
        brand_map[normalize_brand(brand)] = urljoin(BASE_URL, path)

    aliases = {
        "MERCEDES BENZ": "MERCEDES-BENZ",
        "SKODA": "SKODA",
        "CITROEN": "CITROEN",
        "VAUXHALL": "OPEL",
    }
    for source_brand, target_brand in aliases.items():
        target_key = normalize_brand(target_brand)
        if target_key in brand_map:
            brand_map[normalize_brand(source_brand)] = brand_map[target_key]

    return brand_map


def html_to_text(value: str) -> str:
    text = re.sub(r"<[^>]+>", " ", value)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def parse_int_from_text(value: str) -> int | None:
    digits = re.findall(r"\d+", value)
    if not digits:
        return None
    return int(digits[0])


def parse_trunk_liters(block_html: str) -> int | None:
    plain = html_to_text(block_html)

    boot_match = re.search(r"Boot space:\s*([^\.\n]+)", plain, re.I)
    if boot_match:
        numbers = [int(item) for item in re.findall(r"\d{2,4}", boot_match.group(1))]
        if numbers:
            return max(numbers)

    seats_match = re.search(r"With 5 seater:\s*([^\.\n]+)", plain, re.I)
    if seats_match:
        numbers = [int(item) for item in re.findall(r"\d{2,4}", seats_match.group(1))]
        if numbers:
            return max(numbers)

    return None


def parse_brand_models(brand_html: str) -> list[BrandModelCandidate]:
    out: list[BrandModelCandidate] = []
    for match in UNIT_BLOCK_RE.finditer(brand_html):
        block = match.group("block")

        title_match = re.search(r"<h2>(.*?)</h2>", block, re.S | re.I)
        link_match = re.search(r'<a href="(?P<href>/model/[^\"]+)"', block, re.I)
        image_match = re.search(r'<img class="fotos"[^>]*src="(?P<src>[^\"]+)"', block, re.I)

        if not title_match or not link_match:
            continue

        plain = html_to_text(block)
        dimensions_match = re.search(r"L x W x H:\s*(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*mm", plain, re.I)
        length_mm = int(dimensions_match.group(1)) if dimensions_match else None
        width_mm = int(dimensions_match.group(2)) if dimensions_match else None

        image_url = None
        if image_match:
            image_url = urljoin(BASE_URL, image_match.group("src"))

        out.append(
            BrandModelCandidate(
                title=html_to_text(title_match.group(1)),
                model_url=urljoin(BASE_URL, link_match.group("href")),
                image_url=image_url,
                length_mm=length_mm,
                width_mm=width_mm,
                trunk_liters=parse_trunk_liters(block),
            )
        )
    return out


def strip_brand_prefix(model: str, brand: str) -> str:
    model_tokens = tokenize(model)
    brand_tokens = tokenize(brand)

    while model_tokens[: len(brand_tokens)] == brand_tokens and brand_tokens:
        model_tokens = model_tokens[len(brand_tokens) :]

    return " ".join(model_tokens)


def normalize_model_for_match(model: str, brand: str) -> str:
    text = strip_brand_prefix(model, brand)
    text = normalize_text(text)
    replacements = {
        "C HR": "CHR",
        "RAV 4": "RAV4",
        "E TECH": "ETECH",
        "DM I": "DMI",
        "I 30": "I30",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return text


def core_match_tokens(model: str, brand: str) -> list[str]:
    normalized = normalize_model_for_match(model, brand)
    out: list[str] = []
    for token in normalized.split(" "):
        if not token:
            continue
        if token in MATCH_STOPWORDS:
            continue
        if token.isdigit() and len(token) == 4 and 1990 <= int(token) <= 2035:
            continue
        out.append(token)
    return out


def loose_token_overlap(left: list[str], right: list[str]) -> int:
    overlap = 0
    for left_token in left:
        for right_token in right:
            if left_token == right_token:
                overlap += 1
                break
            if len(left_token) >= 3 and len(right_token) >= 3:
                if left_token.startswith(right_token) or right_token.startswith(left_token):
                    overlap += 1
                    break
    return overlap


def score_candidate(target_model: str, brand: str, candidate_title: str) -> float:
    target = normalize_model_for_match(target_model, brand)
    candidate = normalize_model_for_match(candidate_title, brand)

    if not target or not candidate:
        return -1.0

    target_tokens = set(target.split(" "))
    candidate_tokens = set(candidate.split(" "))
    token_overlap = len(target_tokens & candidate_tokens)

    compact_target = target.replace(" ", "")
    compact_candidate = candidate.replace(" ", "")

    score = 0.0
    if compact_target == compact_candidate:
        score += 6.0
    elif compact_candidate and compact_candidate in compact_target:
        score += 4.0
    elif compact_target and compact_target in compact_candidate:
        score += 2.0

    if candidate_tokens:
        score += 5.0 * (token_overlap / len(candidate_tokens))
        if candidate_tokens.issubset(target_tokens):
            score += 1.5

    score += 2.0 * SequenceMatcher(None, compact_target, compact_candidate).ratio()

    if token_overlap == 0:
        score -= 2.0

    target_core_tokens = core_match_tokens(target_model, brand)
    candidate_core_tokens = core_match_tokens(candidate_title, brand)
    if candidate_core_tokens:
        core_overlap = loose_token_overlap(target_core_tokens, candidate_core_tokens)
        score += 6.0 * (core_overlap / len(candidate_core_tokens))
        if target_core_tokens and target_core_tokens[0] == candidate_core_tokens[0]:
            score += 2.5
        if core_overlap == 0:
            score -= 3.0

    return score


def best_candidate_for_model(model: TopModel, candidates: list[BrandModelCandidate]) -> BrandModelCandidate | None:
    ranked = sorted(
        (
            (score_candidate(model.model, model.brand, candidate.title), candidate)
            for candidate in candidates
        ),
        key=lambda item: item[0],
        reverse=True,
    )
    if not ranked:
        return None

    best_score, best_candidate = ranked[0]
    if best_score < 3.2:
        return None

    return best_candidate


def map_body_type(category_href: str | None, category_text: str | None) -> str | None:
    if category_href:
        key = category_href.rsplit("/", 1)[-1].lower()
        mapped = BODY_TYPE_BY_CATEGORY_PATH.get(key)
        if mapped:
            return mapped

    if category_text:
        normalized = normalize_text(category_text).lower()
        mapped = BODY_TYPE_BY_CATEGORY_TEXT.get(normalized)
        if mapped:
            return mapped

    return None


def fetch_body_type(model_url: str) -> str | None:
    html_text = fetch_text(model_url)
    category_match = re.search(r'category of\s*<a href="(?P<href>[^"]+)"[^>]*>(?P<text>[^<]+)</a>', html_text, re.I)
    if not category_match:
        return None
    return map_body_type(category_match.group("href"), category_match.group("text"))


def load_cache(path: Path) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError(f"Invalid cache JSON in {path}")
    out: dict[str, dict[str, Any]] = {}
    for key, value in data.items():
        if isinstance(key, str) and isinstance(value, dict):
            out[key] = value
    return out


def write_cache(path: Path, cache_data: dict[str, dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(dict(sorted(cache_data.items())), ensure_ascii=False, indent=2)
    path.write_text(serialized + "\n", encoding="utf-8")


def ts_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def write_auto_metadata_ts(
    path: Path,
    models_order: list[TopModel],
    cache_data: dict[str, dict[str, Any]],
) -> None:
    ordered_ids = [model.id for model in models_order if model.id in cache_data]
    remaining_ids = sorted(set(cache_data.keys()) - set(ordered_ids))
    all_ids = ordered_ids + remaining_ids

    lines: list[str] = []
    lines.append('import type { CarMetadata } from "@/data/car-metadata"')
    lines.append("")
    lines.append("// Auto-generated by scripts/fetch_car_metadata.py")
    lines.append("// Source: https://www.automobiledimension.com/")
    lines.append("export const carMetadataAutoById: Record<string, CarMetadata> = {")

    for model_id in all_ids:
        metadata = cache_data[model_id]
        lines.append(f'  "{ts_string(model_id)}": {{')
        if isinstance(metadata.get("bodyType"), str):
            lines.append(f'    bodyType: "{ts_string(metadata["bodyType"])}",')
        if isinstance(metadata.get("lengthMm"), int):
            lines.append(f'    lengthMm: {metadata["lengthMm"]},')
        if isinstance(metadata.get("widthMm"), int):
            lines.append(f'    widthMm: {metadata["widthMm"]},')
        if isinstance(metadata.get("trunkLiters"), int):
            lines.append(f'    trunkLiters: {metadata["trunkLiters"]},')
        if isinstance(metadata.get("imageUrl"), str):
            lines.append(f'    imageUrl: "{ts_string(metadata["imageUrl"])}",')
        lines.append("  },")

    lines.append("} as const")
    lines.append("")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def fetch_brand_models(brand: str, brand_page_url: str) -> tuple[str, list[BrandModelCandidate], str | None]:
    try:
        brand_html = fetch_text(brand_page_url)
        return brand, parse_brand_models(brand_html), None
    except Exception as exc:  # noqa: BLE001
        return brand, [], str(exc)


def build_metadata_entry(candidate: BrandModelCandidate, body_type: str | None) -> dict[str, Any]:
    entry: dict[str, Any] = {}
    if body_type:
        entry["bodyType"] = body_type
    if candidate.length_mm is not None:
        entry["lengthMm"] = candidate.length_mm
    if candidate.width_mm is not None:
        entry["widthMm"] = candidate.width_mm
    if candidate.trunk_liters is not None:
        entry["trunkLiters"] = candidate.trunk_liters
    if candidate.image_url:
        entry["imageUrl"] = candidate.image_url
    return entry


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch metadata for missing top-selling models in Spain")
    parser.add_argument("--sales-file", type=Path, default=Path("src/data/sales-rolling-12m.ts"))
    parser.add_argument("--manual-metadata", type=Path, default=Path("src/data/car-metadata.ts"))
    parser.add_argument("--auto-metadata-ts", type=Path, default=Path("src/data/car-metadata-auto.ts"))
    parser.add_argument("--cache-json", type=Path, default=Path("data/car-metadata-auto-cache.json"))
    parser.add_argument("--workers", type=int, default=10)
    parser.add_argument("--limit", type=int, default=0, help="Optional number of pending models to fetch")
    args = parser.parse_args()

    top_models = parse_top_models(args.sales_file)
    if not top_models:
        raise RuntimeError(f"No models parsed from {args.sales_file}")

    manual_ids = parse_metadata_ids(args.manual_metadata)
    cache_data = load_cache(args.cache_json)

    pending_models = [
        model for model in top_models if model.id not in manual_ids and model.id not in cache_data
    ]
    if args.limit > 0:
        pending_models = pending_models[: args.limit]

    home_html = fetch_text(BASE_URL)
    brand_page_map = build_brand_page_map(home_html)

    pending_by_brand: dict[str, list[TopModel]] = {}
    for model in pending_models:
        pending_by_brand.setdefault(model.brand, []).append(model)

    brand_candidates: dict[str, list[BrandModelCandidate]] = {}
    brand_fetch_errors: dict[str, str] = {}

    with ThreadPoolExecutor(max_workers=max(1, min(args.workers, len(pending_by_brand) or 1))) as pool:
        futures = []
        for brand in pending_by_brand:
            brand_key = normalize_brand(brand)
            brand_page_url = brand_page_map.get(brand_key)
            if not brand_page_url:
                brand_slug = normalize_brand(brand).lower().replace(" ", "-")
                brand_page_url = urljoin(BASE_URL, f"{brand_slug}-car-dimensions.html")
            futures.append(pool.submit(fetch_brand_models, brand, brand_page_url))

        for future in as_completed(futures):
            brand, candidates, error = future.result()
            if error:
                brand_fetch_errors[brand] = error
            brand_candidates[brand] = candidates

    matches: dict[str, BrandModelCandidate] = {}
    unresolved: list[TopModel] = []
    for model in pending_models:
        candidate = best_candidate_for_model(model, brand_candidates.get(model.brand, []))
        if candidate is None:
            unresolved.append(model)
            continue
        matches[model.id] = candidate

    unique_model_urls = sorted({candidate.model_url for candidate in matches.values()})
    body_type_by_url: dict[str, str | None] = {}

    with ThreadPoolExecutor(max_workers=max(1, min(args.workers, len(unique_model_urls) or 1))) as pool:
        future_by_url = {pool.submit(fetch_body_type, url): url for url in unique_model_urls}
        for future in as_completed(future_by_url):
            model_url = future_by_url[future]
            try:
                body_type_by_url[model_url] = future.result()
            except Exception:  # noqa: BLE001
                body_type_by_url[model_url] = None

    new_entries = 0
    for model in pending_models:
        candidate = matches.get(model.id)
        if candidate is None:
            continue
        body_type = body_type_by_url.get(candidate.model_url)
        entry = build_metadata_entry(candidate, body_type)
        if not entry:
            continue
        cache_data[model.id] = entry
        new_entries += 1

    write_cache(args.cache_json, cache_data)
    write_auto_metadata_ts(args.auto_metadata_ts, top_models, cache_data)

    total_missing_after = [
        model
        for model in top_models
        if model.id not in manual_ids and model.id not in cache_data
    ]

    print("Metadata fetch summary")
    print(f"- top models parsed: {len(top_models)}")
    print(f"- manual metadata ids: {len(manual_ids)}")
    print(f"- auto metadata cache ids (after run): {len(cache_data)}")
    print(f"- pending models this run: {len(pending_models)}")
    print(f"- newly cached entries: {new_entries}")
    print(f"- still missing after run: {len(total_missing_after)}")

    if brand_fetch_errors:
        print("- brand page errors:")
        for brand, error in sorted(brand_fetch_errors.items()):
            print(f"  - {brand}: {error}")

    if unresolved:
        print("- unresolved models this run:")
        for model in sorted(unresolved, key=lambda item: item.sales_rank_12m):
            print(f"  - #{model.sales_rank_12m} {model.id} ({model.brand} {model.model})")

    if total_missing_after:
        print("- models still missing metadata:")
        for model in sorted(total_missing_after, key=lambda item: item.sales_rank_12m):
            print(f"  - #{model.sales_rank_12m} {model.id} ({model.brand} {model.model})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
