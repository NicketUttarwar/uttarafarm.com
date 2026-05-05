#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

backup_state
run_tf apply \
  -var-file="${TF_VARS_FILE}" \
  -var='manage_route53_records=false' \
  -auto-approve

echo ""
echo "Phase 3 rollback complete. Route53 records managed by Terraform were removed."
