#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_TIMEOUT_SECONDS = 30
TOP_MODEL_RE = re.compile(
    r"\{\s*id: \"(?P<id>[^\"]+)\",\s*brand: \"(?P<brand>[^\"]+)\",\s*model: \"(?P<model>[^\"]+)\",\s*salesRank12m: (?P<rank>\d+),\s*salesUnits12m: (?P<units>\d+),\s*\}",
    re.S,
)
METADATA_KEY_RE = re.compile(r'^\s*"(?P<id>[^"]+)": \{$', re.M)

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


@dataclass(frozen=True)
class TopModel:
    id: str
    brand: str
    model: str
    sales_rank_12m: int
    sales_units_12m: int


@dataclass(frozen=True)
class SourceModel:
    model_url: str
    image_url: str | None
    length_mm: int | None
    width_mm: int | None
    trunk_liters: int | None


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


def fetch_text(
    url: str, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS, retries: int = 2
) -> str:
    request = Request(url, headers={"User-Agent": "CodexCarMetadata/2.0"})
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


def load_mapping(path: Path) -> dict[str, dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError(f"Invalid mapping format in {path}")

    out: dict[str, dict[str, Any]] = {}
    for model_id, entry in data.items():
        if not isinstance(model_id, str) or not isinstance(entry, dict):
            continue
        model_url = entry.get("modelUrl")
        if not isinstance(model_url, str):
            continue
        out[model_id] = entry
    return out


def load_source_truth(
    path: Path, manual_source_path: Path | None
) -> dict[str, SourceModel]:
    data = json.loads(path.read_text(encoding="utf-8"))
    brands = data.get("brands")
    if not isinstance(brands, list):
        raise RuntimeError(f"Invalid source-truth format in {path}")

    out: dict[str, SourceModel] = {}
    for brand_entry in brands:
        if not isinstance(brand_entry, dict):
            continue
        models = brand_entry.get("models")
        if not isinstance(models, list):
            continue
        for model in models:
            if not isinstance(model, dict):
                continue
            model_url = model.get("modelUrl")
            if not isinstance(model_url, str):
                continue
            out[model_url] = SourceModel(
                model_url=model_url,
                image_url=model.get("imageUrl")
                if isinstance(model.get("imageUrl"), str)
                else None,
                length_mm=model.get("lengthMm")
                if isinstance(model.get("lengthMm"), int)
                else None,
                width_mm=model.get("widthMm")
                if isinstance(model.get("widthMm"), int)
                else None,
                trunk_liters=model.get("trunkLiters")
                if isinstance(model.get("trunkLiters"), int)
                else None,
            )
    if manual_source_path and manual_source_path.exists():
        manual_data = json.loads(manual_source_path.read_text(encoding="utf-8"))
        manual_models = manual_data.get("models", [])
        if isinstance(manual_models, list):
            for item in manual_models:
                if not isinstance(item, dict):
                    continue
                model_url = item.get("modelUrl")
                if not isinstance(model_url, str):
                    continue
                out[model_url] = SourceModel(
                    model_url=model_url,
                    image_url=item.get("imageUrl")
                    if isinstance(item.get("imageUrl"), str)
                    else None,
                    length_mm=item.get("lengthMm")
                    if isinstance(item.get("lengthMm"), int)
                    else None,
                    width_mm=item.get("widthMm")
                    if isinstance(item.get("widthMm"), int)
                    else None,
                    trunk_liters=item.get("trunkLiters")
                    if isinstance(item.get("trunkLiters"), int)
                    else None,
                )

    return out


def map_body_type(category_href: str | None, category_text: str | None) -> str | None:
    if category_href:
        key = category_href.rsplit("/", 1)[-1].lower()
        mapped = BODY_TYPE_BY_CATEGORY_PATH.get(key)
        if mapped:
            return mapped

    if category_text:
        normalized = re.sub(r"\s+", " ", category_text.lower()).strip()
        mapped = BODY_TYPE_BY_CATEGORY_TEXT.get(normalized)
        if mapped:
            return mapped

    return None


def fetch_body_type(model_url: str) -> str | None:
    html_text = fetch_text(model_url)
    category_match = re.search(
        r'category of\s*<a href="(?P<href>[^"]+)"[^>]*>(?P<text>[^<]+)</a>',
        html_text,
        re.I,
    )
    if not category_match:
        return None
    return map_body_type(category_match.group("href"), category_match.group("text"))


def load_cache(
    path: Path,
    mapping_by_id: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}

    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError(f"Invalid cache JSON in {path}")

    out: dict[str, dict[str, Any]] = {}
    for key, value in data.items():
        if not isinstance(key, str) or not isinstance(value, dict):
            continue
        if key.startswith("http://") or key.startswith("https://"):
            out[key] = value
            continue

        # Backward-compat read for older Spanish-ID keyed cache files.
        mapping_entry = mapping_by_id.get(key)
        if mapping_entry is None:
            continue
        model_url = mapping_entry.get("modelUrl")
        if isinstance(model_url, str):
            out[model_url] = value

    return out


def write_cache(path: Path, cache_data: dict[str, dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(
        dict(sorted(cache_data.items())), ensure_ascii=False, indent=2
    )
    path.write_text(serialized + "\n", encoding="utf-8")


def ts_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def build_entry(
    source: SourceModel,
    mapped: dict[str, Any],
    body_type: str | None,
    existing: dict[str, Any] | None,
) -> dict[str, Any]:
    entry: dict[str, Any] = {}
    if existing:
        entry.update(existing)

    if body_type:
        entry["bodyType"] = body_type
    if source.length_mm is not None:
        entry["lengthMm"] = source.length_mm
    if source.width_mm is not None:
        entry["widthMm"] = source.width_mm
    if source.trunk_liters is not None:
        entry["trunkLiters"] = source.trunk_liters
    if source.image_url:
        entry["imageUrl"] = source.image_url

    canonical_model_id = mapped.get("canonicalModelId")
    canonical_brand = mapped.get("canonicalBrand")
    canonical_model = mapped.get("canonicalModel")
    canonical_name = mapped.get("canonicalName")

    if isinstance(canonical_model_id, str):
        entry["canonicalModelId"] = canonical_model_id
    if isinstance(canonical_brand, str):
        entry["canonicalBrand"] = canonical_brand
    if isinstance(canonical_model, str):
        entry["canonicalModel"] = canonical_model
    if isinstance(canonical_name, str):
        entry["canonicalName"] = canonical_name

    return entry


def write_auto_metadata_ts(
    path: Path,
    models_order: list[TopModel],
    metadata_by_id: dict[str, dict[str, Any]],
) -> None:
    ordered_ids = [model.id for model in models_order if model.id in metadata_by_id]
    lines: list[str] = []
    lines.append('import type { CarMetadata } from "@/data/car-metadata"')
    lines.append("")
    lines.append("// Auto-generated by scripts/fetch_car_metadata.py")
    lines.append(
        "// Source: data/spanish-to-canonical-mapping.json + data/automobiledimension-brand-models.json"
    )
    lines.append("export const carMetadataAutoById: Record<string, CarMetadata> = {")

    for model_id in ordered_ids:
        metadata = metadata_by_id[model_id]
        lines.append(f'  "{ts_string(model_id)}": {{')
        if isinstance(metadata.get("bodyType"), str):
            lines.append(f'    bodyType: "{ts_string(metadata["bodyType"])}",')
        if isinstance(metadata.get("lengthMm"), int):
            lines.append(f"    lengthMm: {metadata['lengthMm']},")
        if isinstance(metadata.get("widthMm"), int):
            lines.append(f"    widthMm: {metadata['widthMm']},")
        if isinstance(metadata.get("trunkLiters"), int):
            lines.append(f"    trunkLiters: {metadata['trunkLiters']},")
        if isinstance(metadata.get("imageUrl"), str):
            lines.append(f'    imageUrl: "{ts_string(metadata["imageUrl"])}",')
        if isinstance(metadata.get("canonicalModelId"), str):
            lines.append(
                f'    canonicalModelId: "{ts_string(metadata["canonicalModelId"])}",'
            )
        if isinstance(metadata.get("canonicalBrand"), str):
            lines.append(
                f'    canonicalBrand: "{ts_string(metadata["canonicalBrand"])}",'
            )
        if isinstance(metadata.get("canonicalModel"), str):
            lines.append(
                f'    canonicalModel: "{ts_string(metadata["canonicalModel"])}",'
            )
        if isinstance(metadata.get("canonicalName"), str):
            lines.append(
                f'    canonicalName: "{ts_string(metadata["canonicalName"])}",'
            )
        lines.append("  },")

    lines.append("} as const")
    lines.append("")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Fetch metadata for matched Spanish top-selling models"
    )
    parser.add_argument(
        "--sales-file", type=Path, default=Path("src/data/sales-rolling-12m.ts")
    )
    parser.add_argument(
        "--manual-metadata", type=Path, default=Path("src/data/car-metadata.ts")
    )
    parser.add_argument(
        "--auto-metadata-ts", type=Path, default=Path("src/data/car-metadata-auto.ts")
    )
    parser.add_argument(
        "--cache-json", type=Path, default=Path("data/car-metadata-auto-cache.json")
    )
    parser.add_argument(
        "--mapping-json",
        type=Path,
        default=Path("data/spanish-to-canonical-mapping.json"),
    )
    parser.add_argument(
        "--source-truth-json",
        type=Path,
        default=Path("data/automobiledimension-brand-models.json"),
    )
    parser.add_argument(
        "--manual-source-json",
        type=Path,
        default=Path("data/manual-source-models.json"),
    )
    parser.add_argument("--workers", type=int, default=10)
    parser.add_argument(
        "--limit", type=int, default=0, help="Optional number of models to process"
    )
    args = parser.parse_args()

    top_models = parse_top_models(args.sales_file)
    if not top_models:
        raise RuntimeError(f"No models parsed from {args.sales_file}")

    mapping_by_id = load_mapping(args.mapping_json)
    source_by_url = load_source_truth(args.source_truth_json, args.manual_source_json)
    manual_ids = parse_metadata_ids(args.manual_metadata)

    cache_by_url = load_cache(args.cache_json, mapping_by_id)
    pending_models = list(top_models)
    if args.limit > 0:
        pending_models = pending_models[: args.limit]

    missing_body_type_urls: set[str] = set()
    metadata_by_id: dict[str, dict[str, Any]] = {}
    unmatched_models: list[TopModel] = []

    for model in pending_models:
        mapping = mapping_by_id.get(model.id)
        if mapping is None:
            unmatched_models.append(model)
            continue

        model_url = mapping.get("modelUrl")
        if not isinstance(model_url, str):
            unmatched_models.append(model)
            continue

        source = source_by_url.get(model_url)
        if source is None:
            unmatched_models.append(model)
            continue

        cached_entry = cache_by_url.get(model_url)
        if cached_entry is not None and not isinstance(
            cached_entry.get("bodyType"), str
        ):
            missing_body_type_urls.add(model_url)
        if cached_entry is None:
            missing_body_type_urls.add(model_url)

        metadata_by_id[model.id] = build_entry(source, mapping, None, cached_entry)

    body_type_by_url: dict[str, str | None] = {}
    if missing_body_type_urls:
        with ThreadPoolExecutor(
            max_workers=max(1, min(args.workers, len(missing_body_type_urls)))
        ) as pool:
            futures = {
                pool.submit(fetch_body_type, url): url
                for url in sorted(missing_body_type_urls)
            }
            for future in as_completed(futures):
                model_url = futures[future]
                try:
                    body_type_by_url[model_url] = future.result()
                except Exception:  # noqa: BLE001
                    body_type_by_url[model_url] = None

    for model in pending_models:
        entry = metadata_by_id.get(model.id)
        if entry is None:
            continue

        mapping = mapping_by_id[model.id]
        model_url = mapping["modelUrl"]
        source = source_by_url[model_url]
        body_type = body_type_by_url.get(model_url)

        merged = build_entry(source, mapping, body_type, cache_by_url.get(model_url))
        metadata_by_id[model.id] = merged
        cache_by_url[model_url] = merged

    write_cache(args.cache_json, cache_by_url)
    write_auto_metadata_ts(args.auto_metadata_ts, top_models, metadata_by_id)

    unresolved_after = [model for model in top_models if model.id not in metadata_by_id]

    print("Metadata fetch summary")
    print(f"- top models parsed: {len(top_models)}")
    print(f"- manual metadata ids: {len(manual_ids)}")
    print(f"- mapping entries loaded: {len(mapping_by_id)}")
    print(f"- source-truth models loaded: {len(source_by_url)}")
    print(f"- url-keyed cache entries (after run): {len(cache_by_url)}")
    print(f"- models processed this run: {len(pending_models)}")
    print(f"- unresolved this run: {len(unmatched_models)}")
    print(f"- still missing after run: {len(unresolved_after)}")

    if unmatched_models:
        print("- unresolved models this run:")
        for model in sorted(unmatched_models, key=lambda item: item.sales_rank_12m):
            print(
                f"  - #{model.sales_rank_12m} {model.id} ({model.brand} {model.model})"
            )

    if unresolved_after:
        print("- models still missing metadata:")
        for model in sorted(unresolved_after, key=lambda item: item.sales_rank_12m):
            print(
                f"  - #{model.sales_rank_12m} {model.id} ({model.brand} {model.model})"
            )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
