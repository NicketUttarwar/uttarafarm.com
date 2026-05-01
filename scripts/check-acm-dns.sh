#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

CERT_ARN="$(cd "${TF_DIR}" && terraform output -raw acm_certificate_arn)"

aws acm describe-certificate \
  --certificate-arn "${CERT_ARN}" \
  --region "${AWS_DEFAULT_REGION:-us-east-1}" \
  --query 'Certificate.{Status:Status,DomainValidationOptions:DomainValidationOptions[*].{DomainName:DomainName,ValidationStatus:ValidationStatus,RecordName:ResourceRecord.Name,RecordType:ResourceRecord.Type,RecordValue:ResourceRecord.Value}}'
