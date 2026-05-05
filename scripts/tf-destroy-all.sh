#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

extract_tfvars_value() {
  local key="${1}"
  awk -F'=' -v search_key="${key}" '
    $1 ~ "^[[:space:]]*"search_key"[[:space:]]*$" {
      value=$2
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      gsub(/^"/, "", value)
      gsub(/"$/, "", value)
      print value
      exit
    }
  ' "${TF_VARS_FILE}"
}

SITE_BUCKET="$(extract_tfvars_value "site_bucket_name" || true)"
TMP_VARS_FILE="$(mktemp)"
trap 'rm -f "${TMP_VARS_FILE}"' EXIT

# Keep only Terraform-declared input vars and drop script-only flags (for example FORCE_DESTROY_ALL).
awk '
  /^[[:space:]]*#/ { print; next }
  /^[[:space:]]*$/ { print; next }
  /^[[:space:]]*(project_name|environment|aws_region|site_bucket_name|domain_names|vpc_id|public_subnet_ids|web_ami_id|common_tags|route53_zone_name|route53_zone_id|create_route53_zone|manage_route53_records|web_instance_type|web_desired_capacity|web_min_size|web_max_size)[[:space:]]*=/ { print; next }
  /^[[:space:]]*}/ { print; next }
' "${TF_VARS_FILE}" > "${TMP_VARS_FILE}"

echo "warning: this will destroy ALL Terraform-managed infrastructure for this repo."
echo "warning: includes S3, ACM, EC2/ALB, Global Accelerator, and Route53 resources in Terraform state."
echo ""

if [[ "${FORCE_DESTROY_ALL:-false}" != "true" ]]; then
  echo "Set FORCE_DESTROY_ALL=true to continue."
  echo "Example: FORCE_DESTROY_ALL=true bash scripts/tf-destroy-all.sh"
  exit 1
fi

backup_state

if [[ -n "${SITE_BUCKET}" ]]; then
  echo "Emptying S3 bucket before destroy: ${SITE_BUCKET}"
  aws s3 rm "s3://${SITE_BUCKET}" --recursive || true
fi

run_tf destroy \
  -var-file="${TMP_VARS_FILE}" \
  -auto-approve

echo ""
echo "Destroy complete. Terraform-managed infrastructure has been removed."
