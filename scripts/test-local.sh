#!/usr/bin/env bash
# Local dev: ensure .venv exists, ensure npm deps, use a fixed port, run Vite,
# open the browser, and stop the server when this script exits (Ctrl+C or kill).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PYTHON_BIN=""
for candidate in python3 python; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PYTHON_BIN="$candidate"
    break
  fi
done
if [[ -z "${PYTHON_BIN}" ]]; then
  echo "error: python3 (or python) is required to create or use .venv" >&2
  exit 1
fi

VENV_PATH="${ROOT}/.venv"
if [[ ! -d "${VENV_PATH}" ]]; then
  echo "creating virtual environment at .venv ..."
  "${PYTHON_BIN}" -m venv "${VENV_PATH}"
fi

# shellcheck disable=SC1091
source "${VENV_PATH}/bin/activate"

if [[ -f "${ROOT}/requirements.txt" ]]; then
  if grep -v '^[[:space:]]*#' "${ROOT}/requirements.txt" | grep -q '[^[:space:]]'; then
    echo "installing Python packages from requirements.txt ..."
    python -m pip install -q --upgrade pip >/dev/null 2>&1 || true
    python -m pip install -q -r "${ROOT}/requirements.txt"
  fi
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "error: node and npm must be installed and on PATH (install Node.js from nodejs.org or your package manager)" >&2
  exit 1
fi

if [[ ! -d "${ROOT}/node_modules" ]]; then
  echo "installing npm dependencies (node_modules missing) ..."
  npm install
fi

PORT=9999
export PORT

free_port() {
  if ! command -v lsof >/dev/null 2>&1; then
    return
  fi

  local pids
  pids="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    echo "releasing port ${PORT} from existing listener(s): ${pids}"
    # shellcheck disable=SC2086
    kill ${pids} 2>/dev/null || true
  fi
}

cleanup() {
  if [[ -n "${DEV_PID:-}" ]] && kill -0 "${DEV_PID}" 2>/dev/null; then
    echo ""
    echo "stopping dev server (pid ${DEV_PID}) ..."
    kill "${DEV_PID}" 2>/dev/null || true
    wait "${DEV_PID}" 2>/dev/null || true
  fi
  free_port
}
trap cleanup EXIT INT TERM HUP

free_port

echo "starting Vite on http://127.0.0.1:${PORT}/"
npm run dev -- --host 127.0.0.1 --port "${PORT}" --strictPort &
DEV_PID=$!

# Give Vite time to bind before opening the browser
sleep 2

URL="http://127.0.0.1:${PORT}/"
if [[ "$(uname -s)" == "Darwin" ]]; then
  open "${URL}" || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${URL}" || true
else
  echo "open this URL in your browser: ${URL}"
fi

echo "press Ctrl+C to stop the server and release the port."
wait "${DEV_PID}" || true
