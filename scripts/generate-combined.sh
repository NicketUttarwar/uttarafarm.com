#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${ROOT}/dist"
COMBINED_DIR="${ROOT}/combined"

if [[ ! -d "${DIST_DIR}" ]]; then
  echo "error: dist/ does not exist. Run npm run build first." >&2
  exit 1
fi

rm -rf "${COMBINED_DIR}"
mkdir -p "${COMBINED_DIR}"

cp -R "${DIST_DIR}/." "${COMBINED_DIR}/"

# Mirror canonical app routes as directory indexes for S3 website routing.
ROUTES=(
  "timeline"
  "story"
  "impact"
  "contact"
  "how-we-work"
)

for route in "${ROUTES[@]}"; do
  mkdir -p "${COMBINED_DIR}/${route}"
  cp "${COMBINED_DIR}/index.html" "${COMBINED_DIR}/${route}/index.html"
done

# Keep compatibility alias for llm.txt.
if [[ -f "${COMBINED_DIR}/llms.txt" ]]; then
  cp "${COMBINED_DIR}/llms.txt" "${COMBINED_DIR}/llm.txt"
fi

echo "combined artifact generated at ${COMBINED_DIR}"
