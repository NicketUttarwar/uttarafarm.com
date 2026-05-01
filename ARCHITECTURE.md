# ARCHITECTURE

This document captures the repository-level implementation of the Path B operating model.

## System Model

- Application source: `src/` (React + TypeScript)
- Build output: `dist/`
- Deploy artifact: `combined/` (generated from `dist/`)
- Hosting model: S3 website endpoint origin + CloudFront
- DNS model: external provider-managed records

## Deployment Workflow

1. Configure local credentials and tfvars in `config/`.
2. Confirm dedicated network inputs in tfvars (`vpc_name`, `public_subnet_name`, `vpc_cidr_block`, `public_subnet_cidr_block`, `public_subnet_availability_zone`).
3. Generate deploy artifact: `npm run build:combined`.
4. Run Terraform phase 1 to create network baseline + initial website resources.
5. Perform external ACM validation DNS updates.
6. Complete Terraform apply.
7. Sync `combined/` to S3 and invalidate CloudFront.

## Phase Model (Path B)

- **Phase 1:** local readiness + dedicated VPC/public subnet baseline + first apply (`tf-apply-phase1.sh`)
- **Phase 2:** external DNS validation records for ACM
- **Phase 3:** full Terraform apply after certificate issuance
- **Phase 4:** artifact sync and CloudFront invalidation
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
- Use phased rollout with explicit validation gates for DNS and certificate status.
- Avoid manual edits to Terraform state JSON.

## Document Version

- Version: `v0.1.0`
- Last updated: `2026-05-01`
- Change class: Path B phase model updated for dedicated VPC/public subnet baseline
