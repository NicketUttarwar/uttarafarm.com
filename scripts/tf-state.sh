#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tf-common.sh"
ensure_config_files
load_aws_env

if [[ $# -eq 0 ]]; then
  echo "usage: $0 <terraform state subcommand and args>" >&2
  echo "example: $0 list" >&2
  exit 1
fi

run_tf state "$@"
