#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

if [[ -f "${TF_DIR}/.tfplan" ]]; then
  run_tf show "${TF_DIR}/.tfplan"
else
  run_tf show
fi
