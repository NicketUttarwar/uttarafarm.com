#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_DIR="${ROOT}/terraform"
CONFIG_DIR="${ROOT}/config"
AWS_ENV_FILE="${CONFIG_DIR}/aws.env"
TF_VARS_FILE="${CONFIG_DIR}/terraform.tfvars"
STATE_DIR="${TF_DIR}/state"
SESSION_STATE="${STATE_DIR}/session/latest.tfstate"

ensure_config_files() {
  if [[ ! -f "${AWS_ENV_FILE}" ]]; then
    echo "error: missing ${AWS_ENV_FILE}. Copy config/aws.env.example and set credentials." >&2
    exit 1
  fi

  if [[ ! -f "${TF_VARS_FILE}" ]]; then
    echo "error: missing ${TF_VARS_FILE}. Copy config/terraform.tfvars.example and customize." >&2
    exit 1
  fi
}

load_aws_env() {
  set -a
  # shellcheck disable=SC1090
  source "${AWS_ENV_FILE}"
  set +a
}

run_tf() {
  (cd "${TF_DIR}" && terraform "$@")
}

# Terraform 1.2+ prints a bare JSON-encoded value for `terraform output -json NAME`.
# Older states used a wrapper object with a "value" key.
tf_output_value_from_json() {
  printf '%s' "${1}" | jq -r 'if type == "string" then . elif type == "object" then (.value // empty) else empty end'
}

backup_state() {
  mkdir -p "$(dirname "${SESSION_STATE}")"
  if [[ -f "${STATE_DIR}/terraform.tfstate" ]]; then
    cp "${STATE_DIR}/terraform.tfstate" "${SESSION_STATE}"
  fi
}
