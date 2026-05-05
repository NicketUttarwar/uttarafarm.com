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

ZONE_ID="$(extract_tfvars_value "route53_zone_id" || true)"
ZONE_NAME="$(extract_tfvars_value "route53_zone_name" || true)"
CREATE_ZONE="$(extract_tfvars_value "create_route53_zone" || true)"
CREATE_ZONE="$(printf '%s' "${CREATE_ZONE}" | tr '[:upper:]' '[:lower:]')"

if [[ "${CREATE_ZONE}" == "true" ]]; then
  if [[ -z "${ZONE_NAME}" ]]; then
    echo "error: create_route53_zone=true requires route53_zone_name in config/terraform.tfvars." >&2
    exit 1
  fi
elif [[ "${CREATE_ZONE}" != "" && "${CREATE_ZONE}" != "false" ]]; then
  echo "error: create_route53_zone must be true or false when set." >&2
  exit 1
fi

if [[ -n "${ZONE_ID}" ]]; then
  if [[ "${ZONE_ID}" == "Z1234567890ABC" ]]; then
    echo "error: route53_zone_id is still the README/example placeholder." >&2
    echo "       Replace it with your real hosted zone ID from Route53." >&2
    exit 1
  fi

  if ! aws route53 get-hosted-zone --id "${ZONE_ID}" >/dev/null 2>&1; then
    echo "error: route53_zone_id=${ZONE_ID} was not found in this AWS account." >&2
    echo "       Verify config/aws.env points to the correct account and the hosted zone exists." >&2
    exit 1
  fi
elif [[ "${CREATE_ZONE}" == "true" ]]; then
  # Valid: Terraform will create the hosted zone and then create alias records.
  :
elif [[ -n "${ZONE_NAME}" ]]; then
  MATCH_COUNT="$(aws route53 list-hosted-zones-by-name --dns-name "${ZONE_NAME}" --max-items 10 --query "HostedZones[?Name=='${ZONE_NAME%.}.'].Id | length(@)" --output text 2>/dev/null || true)"
  if [[ -z "${MATCH_COUNT}" || "${MATCH_COUNT}" == "0" ]]; then
    echo "error: no public hosted zone found for route53_zone_name=${ZONE_NAME}." >&2
    echo "       Use a real DNS zone name (for example uttarafarm.com) or set route53_zone_id." >&2
    exit 1
  fi
else
  if [[ "${CREATE_ZONE}" == "true" ]]; then
    echo "error: create_route53_zone=true but route53_zone_name is empty." >&2
  else
    echo "error: set route53_zone_id (preferred) or route53_zone_name, or set create_route53_zone=true." >&2
  fi
  exit 1
fi

backup_state
run_tf apply \
  -var-file="${TF_VARS_FILE}" \
  -var='manage_route53_records=true' \
  -auto-approve

echo ""
echo "Phase 3 complete. Route53 A records now point domains to Global Accelerator static IPs."
if [[ "${CREATE_ZONE}" == "true" ]]; then
  echo "Note: update your registrar nameservers to the Route53 NS values from ./scripts/tf-output.sh route53_name_servers"
fi
