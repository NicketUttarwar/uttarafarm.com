#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

TAG_KEY="${TAG_KEY:-Project}"
TAG_VALUE="${TAG_VALUE:-}"

if [[ -z "${TAG_VALUE}" ]]; then
  if ! command -v jq >/dev/null 2>&1; then
    echo "error: set TAG_VALUE=... or install jq so project_name can be read from terraform output." >&2
    exit 1
  fi
  PROJECT_JSON=""
  if ! PROJECT_JSON="$(run_tf output -json project_name 2>/dev/null)"; then
    echo "error: Terraform output \"project_name\" missing from state." >&2
    echo "      Apply infrastructure first or set TAG_VALUE explicitly (see README)." >&2
    exit 1
  fi
  TAG_VALUE="$(tf_output_value_from_json "${PROJECT_JSON}")"
fi

aws resourcegroupstaggingapi get-resources \
  --region "${AWS_DEFAULT_REGION:-us-east-1}" \
  --tag-filters "Key=${TAG_KEY},Values=${TAG_VALUE}" \
  --query 'ResourceTagMappingList[*].{ARN:ResourceARN,Tags:Tags}'
