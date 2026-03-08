# Car Comparison (Spain)

A React + TypeScript app to compare popular car models in Spain with:

- rolling registration ranking (last 12 full months),
- technical and practical attributes (body type, dimensions, trunk, powertrains),
- URL-persisted filters and sorting.

The ranking data comes from official DGT monthly microdata, replacing static scraped sales values.

## Data model

- Monthly DGT files are downloaded into `data/dgt/monthly`.
- Sales ranking for the app is generated from those ZIP files into `src/data/sales-rolling-12m.ts`.
- `src/data/cars-es.ts` combines:
  - generated rolling sales/rank values,
  - curated model metadata (dimensions, powertrains, labels, image URLs).

The app currently aggregates registrations for vehicle category `M1` over the latest 12 available monthly files.

## Run locally

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```

## Update official data (incremental)

Download only missing monthly files from Jan 2024 onward, then regenerate rolling 12-month ranking:

```bash
pnpm run data:update-rolling-sales
```

This command does not re-download files that already exist in `data/dgt/monthly`.

### Individual data commands

Download missing monthly DGT files:

```bash
pnpm run data:download-dgt
```

Rebuild rolling 12-month sales from local ZIP files:

```bash
pnpm run data:build-rolling-sales
```

## Main files

- `scripts/dgt_matriculaciones.py`: DGT listing fetch + downloader (supports missing-only mode).
- `scripts/build_sales_rolling_12m.py`: generates rolling sales/rank map from local monthly ZIP files.
- `src/data/sales-rolling-12m.ts`: generated rolling sales dataset used by the UI.
- `src/data/cars-es.ts`: app car catalog + data source metadata.
- `src/App.tsx`: filters, sorting, cards/table views.

## Notes

- The rolling window updates automatically when a new monthly DGT file appears and you run `pnpm run data:update-rolling-sales`.
- Older monthly files are assumed stable; update flow is optimized to fetch only missing files.
