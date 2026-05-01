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
2. Generate deploy artifact: `npm run build:combined`.
3. Provision infra with Terraform wrappers in `scripts/`.
4. Perform external ACM validation DNS updates.
5. Complete Terraform apply.
6. Sync `combined/` to S3 and invalidate CloudFront.

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
- Last updated: `2026-04-30`
- Change class: Path B phased deployment model and Terraform workflow
