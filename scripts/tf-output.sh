#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

if [[ "${1:-}" != "" ]]; then
  run_tf output -json "${1}"
else
  run_tf output
fi
