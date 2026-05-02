#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required (same as inspecting JSON from ./scripts/tf-output.sh in README step 15)." >&2
  exit 1
fi

CERT_JSON=""
if ! CERT_JSON="$(run_tf output -json acm_certificate_arn 2>/dev/null)"; then
  echo "error: Terraform output \"acm_certificate_arn\" missing from state." >&2
  echo "      Run Phase 1 (./scripts/tf-apply-phase1.sh) first, then inspect validation with this script." >&2
  exit 1
fi

CERT_ARN="$(tf_output_value_from_json "${CERT_JSON}")"
if [[ -z "${CERT_ARN}" ]] || [[ ! "${CERT_ARN}" =~ ^arn:aws:acm: ]]; then
  echo "error: could not read a valid ACM certificate ARN from terraform state." >&2
  exit 1
fi

aws acm describe-certificate \
  --certificate-arn "${CERT_ARN}" \
  --region "${AWS_DEFAULT_REGION:-us-east-1}" \
  --query 'Certificate.{Status:Status,DomainValidationOptions:DomainValidationOptions[*].{DomainName:DomainName,ValidationStatus:ValidationStatus,RecordName:ResourceRecord.Name,RecordType:ResourceRecord.Type,RecordValue:ResourceRecord.Value}}'
