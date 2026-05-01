#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

backup_state
run_tf apply \
  -var-file="${TF_VARS_FILE}" \
  -target=aws_s3_bucket.site \
  -target=aws_s3_bucket_website_configuration.site \
  -target=aws_s3_bucket_public_access_block.site \
  -target=aws_s3_bucket_policy.site \
  -target=aws_acm_certificate.site \
  -auto-approve

echo ""
echo "Phase 1 complete. Add ACM DNS validation CNAME records, then run scripts/tf-apply.sh."
