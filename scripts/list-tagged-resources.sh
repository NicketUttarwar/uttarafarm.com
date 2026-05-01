#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

TAG_KEY="${TAG_KEY:-Project}"
TAG_VALUE="${TAG_VALUE:-}"

if [[ -z "${TAG_VALUE}" ]]; then
  TAG_VALUE="$(cd "${TF_DIR}" && terraform output -raw project_name)"
fi

aws resourcegroupstaggingapi get-resources \
  --region "${AWS_DEFAULT_REGION:-us-east-1}" \
  --tag-filters "Key=${TAG_KEY},Values=${TAG_VALUE}" \
  --query 'ResourceTagMappingList[*].{ARN:ResourceARN,Tags:Tags}'
