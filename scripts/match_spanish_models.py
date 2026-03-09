#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import unicodedata
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

TOP_MODEL_RE = re.compile(
    r"\{\s*id: \"(?P<id>[^\"]+)\",\s*brand: \"(?P<brand>[^\"]+)\",\s*model: \"(?P<model>[^\"]+)\",\s*salesRank12m: (?P<rank>\d+),\s*salesUnits12m: (?P<units>\d+),\s*\}",
    re.S,
)

BRAND_ALIASES = {
    "MERCEDES BENZ": "MERCEDES-BENZ",
    "VAUXHALL": "OPEL",
}

MODEL_REPLACEMENTS = {
    "C HR": "CHR",
    "RAV 4": "RAV4",
    "E TECH": "ETECH",
    "DM I": "DMI",
    "I 30": "I30",
    "CITRO N": "CITROEN",
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
    "5P",
}


@dataclass(frozen=True)
class TopModel:
    id: str
    brand: str
    model: str
    sales_rank_12m: int
    sales_units_12m: int


@dataclass(frozen=True)
class CanonicalModel:
    brand: str
    name: str
    model: str
    model_url: str


@dataclass(frozen=True)
class MatchResult:
    canonical: CanonicalModel
    method: str
    confidence: str
    score: float


def strip_accents(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def normalize_text(value: str) -> str:
    text = strip_accents(value).upper()
    text = re.sub(r"([A-Z])([0-9])", r"\1 \2", text)
    text = re.sub(r"([0-9])([A-Z])", r"\1 \2", text)
    text = text.replace("&", " ")
    text = re.sub(r"[^A-Z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def normalize_brand(value: str) -> str:
    normalized = normalize_text(value)
    return BRAND_ALIASES.get(normalized, normalized)


def tokenize(value: str) -> list[str]:
    return [token for token in normalize_text(value).split(" ") if token]


def normalize_model(value: str, brand: str) -> str:
    text = normalize_text(value)
    brand_tokens = tokenize(brand)
    model_tokens = text.split(" ")

    while brand_tokens and model_tokens[: len(brand_tokens)] == brand_tokens:
        model_tokens = model_tokens[len(brand_tokens) :]

    text = " ".join(model_tokens)
    for source, target in MODEL_REPLACEMENTS.items():
        text = text.replace(source, target)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def core_tokens(value: str, brand: str) -> list[str]:
    out: list[str] = []
    for token in normalize_model(value, brand).split(" "):
        if not token or token in MATCH_STOPWORDS:
            continue
        if token.isdigit() and len(token) == 4 and 2010 <= int(token) <= 2035:
            continue
        out.append(token)
    return out


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


def model_tokens_to_display(tokens: list[str]) -> str:
    out: list[str] = []
    for token in tokens:
        if any(ch.isdigit() for ch in token) or len(token) <= 2:
            out.append(token)
            continue
        out.append(token[0] + token[1:].lower())
    return " ".join(out).strip()


def split_brand_model_name(brand: str, name: str) -> tuple[str, str]:
    tokens = normalize_text(name).split(" ")
    brand_tokens = normalize_text(brand).split(" ")

    if tokens and tokens[0] == "NEW":
        tokens = tokens[1:]
    if brand_tokens and tokens[: len(brand_tokens)] == brand_tokens:
        tokens = tokens[len(brand_tokens) :]

    if not tokens:
        tokens = normalize_text(name).split(" ")
    model = model_tokens_to_display(tokens)
    return brand, model


def load_canonical_models(
    source_truth_path: Path,
    manual_source_path: Path | None,
) -> tuple[list[CanonicalModel], dict[str, CanonicalModel]]:
    data = json.loads(source_truth_path.read_text(encoding="utf-8"))
    brands = data.get("brands", [])
    by_url: dict[str, CanonicalModel] = {}

    for brand_entry in brands:
        if not isinstance(brand_entry, dict):
            continue
        brand = brand_entry.get("brand")
        models = brand_entry.get("models")
        if not isinstance(brand, str) or not isinstance(models, list):
            continue

        for model_entry in models:
            if not isinstance(model_entry, dict):
                continue
            name = model_entry.get("name")
            model_url = model_entry.get("modelUrl")
            if not isinstance(name, str) or not isinstance(model_url, str):
                continue

            canonical_brand, canonical_model = split_brand_model_name(brand, name)
            model = CanonicalModel(
                brand=canonical_brand,
                name=name,
                model=canonical_model,
                model_url=model_url,
            )
            by_url[model_url] = model

    if manual_source_path and manual_source_path.exists():
        manual_data = json.loads(manual_source_path.read_text(encoding="utf-8"))
        manual_models = manual_data.get("models", [])
        if isinstance(manual_models, list):
            for item in manual_models:
                if not isinstance(item, dict):
                    continue
                brand = item.get("brand")
                name = item.get("name")
                model_url = item.get("modelUrl")
                if (
                    not isinstance(brand, str)
                    or not isinstance(name, str)
                    or not isinstance(model_url, str)
                ):
                    continue
                canonical_brand, canonical_model = split_brand_model_name(brand, name)
                model = CanonicalModel(
                    brand=canonical_brand,
                    name=name,
                    model=canonical_model,
                    model_url=model_url,
                )
                by_url[model_url] = model

    canonical_models = sorted(by_url.values(), key=lambda item: item.model_url)
    return canonical_models, by_url


def load_manual_overrides(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError(f"Invalid overrides format: {path}")

    out: dict[str, str] = {}
    for key, value in data.items():
        if isinstance(key, str) and isinstance(value, str):
            out[key] = value
    return out


def loose_token_overlap(left: list[str], right: list[str]) -> int:
    overlap = 0
    for left_token in left:
        for right_token in right:
            if left_token == right_token:
                overlap += 1
                break
            if len(left_token) >= 3 and len(right_token) >= 3:
                if left_token.startswith(right_token) or right_token.startswith(
                    left_token
                ):
                    overlap += 1
                    break
    return overlap


def match_tokens_score(model: TopModel, candidate: CanonicalModel) -> float:
    left = set(core_tokens(model.model, model.brand))
    right = set(core_tokens(candidate.model, candidate.brand))
    if not left or not right:
        return 0.0
    overlap = loose_token_overlap(sorted(left), sorted(right))
    if overlap == 0:
        return 0.0
    return overlap / max(1, len(right))


def find_match(
    model: TopModel,
    candidates: list[CanonicalModel],
    by_url: dict[str, CanonicalModel],
    manual_overrides: dict[str, str],
) -> tuple[MatchResult | None, MatchResult | None]:
    override_url = manual_overrides.get(model.id)
    if override_url:
        override = by_url.get(override_url)
        if override is None:
            raise RuntimeError(
                f"Override URL not found in source of truth for {model.id}: {override_url}"
            )
        return MatchResult(override, "manual", "high", 1.0), None

    model_brand = normalize_brand(model.brand)
    brand_candidates = [
        item for item in candidates if normalize_brand(item.brand) == model_brand
    ]
    if not brand_candidates:
        return None, None

    model_exact = normalize_model(model.model, model.brand)
    for candidate in brand_candidates:
        if normalize_model(candidate.model, candidate.brand) == model_exact:
            return MatchResult(candidate, "exact", "high", 1.0), None

    ranked = sorted(
        (
            (match_tokens_score(model, candidate), candidate)
            for candidate in brand_candidates
        ),
        key=lambda item: item[0],
        reverse=True,
    )
    if not ranked:
        return None, None

    best_score, best_candidate = ranked[0]
    if best_score >= 0.9:
        return MatchResult(best_candidate, "token", "high", best_score), None
    if best_score >= 0.45:
        return MatchResult(best_candidate, "token", "medium", best_score), None

    low = MatchResult(best_candidate, "token", "low", best_score)
    return None, low


def model_url_to_id(model_url: str) -> str:
    tail = model_url.rstrip("/").split("/")[-2:]
    if len(tail) < 2:
        return model_url.rstrip("/").split("/")[-1]
    return f"{tail[0]}-{tail[1]}"


def write_mapping_json(path: Path, mapping: dict[str, dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(dict(sorted(mapping.items())), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def ts_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def write_mapping_ts(path: Path, mapping: dict[str, dict[str, Any]]) -> None:
    lines: list[str] = []
    lines.append("// Auto-generated by scripts/match_spanish_models.py")
    lines.append("export type CanonicalMappingEntry = {")
    lines.append("  modelUrl: string")
    lines.append("  canonicalModelId: string")
    lines.append("  canonicalBrand: string")
    lines.append("  canonicalModel: string")
    lines.append("  canonicalName: string")
    lines.append('  matchConfidence: "high" | "medium" | "low"')
    lines.append('  matchMethod: "exact" | "token" | "manual"')
    lines.append("}")
    lines.append("")
    lines.append(
        "export const spanishToCanonicalMappingById: Record<string, CanonicalMappingEntry> = {"
    )

    for model_id in sorted(mapping.keys()):
        entry = mapping[model_id]
        lines.append(f'  "{ts_string(model_id)}": {{')
        lines.append(f'    modelUrl: "{ts_string(entry["modelUrl"])}",')
        lines.append(f'    canonicalModelId: "{ts_string(entry["canonicalModelId"])}",')
        lines.append(f'    canonicalBrand: "{ts_string(entry["canonicalBrand"])}",')
        lines.append(f'    canonicalModel: "{ts_string(entry["canonicalModel"])}",')
        lines.append(f'    canonicalName: "{ts_string(entry["canonicalName"])}",')
        lines.append(f'    matchConfidence: "{ts_string(entry["matchConfidence"])}",')
        lines.append(f'    matchMethod: "{ts_string(entry["matchMethod"])}",')
        lines.append("  },")

    lines.append("} as const")
    lines.append("")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Match Spanish sales IDs to canonical model URLs"
    )
    parser.add_argument(
        "--sales-file", type=Path, default=Path("src/data/sales-rolling-12m.ts")
    )
    parser.add_argument(
        "--source-truth",
        type=Path,
        default=Path("data/automobiledimension-brand-models.json"),
    )
    parser.add_argument(
        "--manual-source",
        type=Path,
        default=Path("data/manual-source-models.json"),
    )
    parser.add_argument(
        "--overrides",
        type=Path,
        default=Path("data/spanish-model-overrides.json"),
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=Path("data/spanish-to-canonical-mapping.json"),
    )
    parser.add_argument(
        "--output-ts",
        type=Path,
        default=Path("src/data/spanish-to-canonical-mapping.ts"),
    )
    parser.add_argument(
        "--review-low-confidence",
        action="store_true",
        help="Interactively review low confidence candidates.",
    )
    args = parser.parse_args()

    top_models = parse_top_models(args.sales_file)
    if not top_models:
        raise RuntimeError(f"No models found in {args.sales_file}")

    canonical_models, canonical_by_url = load_canonical_models(
        args.source_truth,
        args.manual_source,
    )
    manual_overrides = load_manual_overrides(args.overrides)

    mapping: dict[str, dict[str, Any]] = {}
    unmatched: list[TopModel] = []
    low_confidence: list[tuple[TopModel, MatchResult]] = []

    for model in top_models:
        match, low = find_match(
            model, canonical_models, canonical_by_url, manual_overrides
        )
        if match is None:
            if low is not None:
                low_confidence.append((model, low))
            else:
                unmatched.append(model)
            continue

        mapping[model.id] = {
            "modelUrl": match.canonical.model_url,
            "canonicalModelId": model_url_to_id(match.canonical.model_url),
            "canonicalBrand": match.canonical.brand,
            "canonicalModel": match.canonical.model,
            "canonicalName": match.canonical.name,
            "matchConfidence": match.confidence,
            "matchMethod": match.method,
            "matchedAt": datetime.now(timezone.utc).isoformat(),
        }

    if args.review_low_confidence:
        for model, low in low_confidence:
            print(
                f"Low confidence: #{model.sales_rank_12m} {model.id} -> "
                f"{low.canonical.name} ({low.score:.2f})"
            )
            answer = input("Accept this match? [y/N]: ").strip().lower()
            if answer != "y":
                unmatched.append(model)
                continue
            mapping[model.id] = {
                "modelUrl": low.canonical.model_url,
                "canonicalModelId": model_url_to_id(low.canonical.model_url),
                "canonicalBrand": low.canonical.brand,
                "canonicalModel": low.canonical.model,
                "canonicalName": low.canonical.name,
                "matchConfidence": low.confidence,
                "matchMethod": low.method,
                "matchedAt": datetime.now(timezone.utc).isoformat(),
            }
    else:
        unmatched.extend(model for model, _ in low_confidence)

    write_mapping_json(args.output_json, mapping)
    write_mapping_ts(args.output_ts, mapping)

    confidence_counts = {"high": 0, "medium": 0, "low": 0}
    method_counts = {"exact": 0, "token": 0, "manual": 0}
    for entry in mapping.values():
        confidence_counts[entry["matchConfidence"]] += 1
        method_counts[entry["matchMethod"]] += 1

    print("Spanish model matching summary")
    print(f"- models parsed: {len(top_models)}")
    print(f"- matched: {len(mapping)}")
    print(f"- unmatched: {len(unmatched)}")
    print(
        "- confidence: "
        f"high={confidence_counts['high']} "
        f"medium={confidence_counts['medium']} "
        f"low={confidence_counts['low']}"
    )
    print(
        "- method: "
        f"exact={method_counts['exact']} "
        f"token={method_counts['token']} "
        f"manual={method_counts['manual']}"
    )

    if unmatched:
        print("- unmatched models:")
        for model in sorted(unmatched, key=lambda item: item.sales_rank_12m):
            print(
                f"  - #{model.sales_rank_12m} {model.id} ({model.brand} {model.model})"
            )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
