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

SITE_BUCKET="$(extract_tfvars_value "site_bucket_name")"
if [[ -z "${SITE_BUCKET}" ]]; then
  echo "error: site_bucket_name not found in ${TF_VARS_FILE}" >&2
  exit 1
fi

cd "${ROOT}"
npm run build:combined
aws s3 sync "${ROOT}/combined/" "s3://${SITE_BUCKET}" --delete

echo "Deployed to s3://${SITE_BUCKET}"
