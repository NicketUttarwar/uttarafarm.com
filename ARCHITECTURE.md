# ARCHITECTURE

This document captures the repository-level implementation of the current deployment model.

## System Model

- Application source: `src/` (React + TypeScript)
- Build output: `dist/`
- Deploy artifact: `combined/` (generated from `dist/`)
- Hosting model: private S3 artifact bucket + EC2/nginx + ALB + Global Accelerator
- DNS model: GoDaddy apex `A` records to Global Accelerator static IPv4 addresses

## Why this architecture exists

GoDaddy does not allow apex (`@`) records to point to a CloudFront domain via CNAME.
That registrar limitation requires stable IPv4 targets for apex DNS.

To satisfy that requirement, this repo now provisions:

- Global Accelerator static Anycast IPs
- ALB as the TLS entrypoint
- EC2 web nodes serving files synced from S3

## Deployment Workflow

1. Configure local credentials and tfvars in `config/`.
2. Confirm Terraform inputs in tfvars:
   - `site_bucket_name`
   - `domain_names`
   - `vpc_id`
   - `public_subnet_ids`
   - `web_ami_id`
3. Generate deploy artifact: `npm run build:combined`.
4. Run Terraform phase 1 to create S3 + ACM request (`tf-apply-phase1.sh`).
5. Perform ACM DNS validation at your DNS provider.
6. Run full Terraform apply (`tf-apply.sh`) to create ALB/ASG/Global Accelerator.
7. Sync `combined/` to S3.
8. Set GoDaddy apex `A` records to `global_accelerator_ip_addresses`.

## Phase Model

- **Phase 1:** targeted apply for S3 + ACM request
- **Phase 2:** external DNS validation records for ACM
- **Phase 3:** full apply for runtime infra and IP outputs
- **Phase 4:** artifact sync and DNS verification
- **Phase 5:** governance, drift checks, and documentation alignment

## Naming and Tagging Standards

- `project_name` is stable across the stack.
- `environment` is one of:
  - `uttarwar-family`
  - `personal`
  - `independent-ventures`
  - `dev`
- Required resource tags:
  - `Project`
  - `Environment`
  - `ManagedBy`
- Recommended tags:
  - `Owner`
  - `CostCenter`

## Change Management

- Infrastructure and architecture changes should land together.
- Keep the phased rollout with explicit validation gates for ACM + DNS.
- Avoid manual edits to Terraform state JSON.

## Document Version

- Version: `v0.2.0`
- Last updated: `2026-05-05`
- Change class: migrated from CloudFront apex workaround to Global Accelerator static-IP apex model for GoDaddy compatibility.
