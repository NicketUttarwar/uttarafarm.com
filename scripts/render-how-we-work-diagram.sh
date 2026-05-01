#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEX_FILE="diagrams/how-we-work-entity-diagram.tex"
PDF_FILE="diagrams/how-we-work-entity-diagram.pdf"
SVG_FILE="public/assets/how-we-work-entity-diagram.svg"

cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to render the LaTeX diagram."
  echo "Install Docker Desktop, then run this script again."
  exit 1
fi

echo "Rendering $TEX_FILE -> $SVG_FILE"
docker run --rm \
  -v "$ROOT_DIR:/work" \
  -w /work \
  blang/latex:ctanfull \
  bash -lc "pdflatex -interaction=nonstopmode -halt-on-error -output-directory=diagrams $TEX_FILE && dvisvgm --pdf --no-fonts -o $SVG_FILE $PDF_FILE"

echo "Done. Updated $SVG_FILE"
