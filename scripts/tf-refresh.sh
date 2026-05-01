#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

backup_state
run_tf apply -refresh-only -var-file="${TF_VARS_FILE}" -auto-approve
