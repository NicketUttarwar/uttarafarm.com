# ARCHITECTURE

This document captures the repository-level implementation of the current deployment model.

## System Model

- Application source: `src/` (React + TypeScript)
- Build output: `dist/`
- Deploy artifact: `combined/` (generated from `dist/`)
- Hosting model: private S3 artifact bucket + CloudFront distribution
- DNS model: external DNS provider (for example GoDaddy), configured manually

## Why this architecture exists

This stack keeps infrastructure fully managed for static hosting:

- S3 stores deploy artifacts privately
- CloudFront serves content globally over HTTPS
- ACM provides certificates for custom domains

## Deployment Workflow

1. Configure local credentials and tfvars in `config/`.
2. Confirm Terraform inputs in tfvars:
   - `site_bucket_name`
   - `domain_names`
3. Generate deploy artifact: `npm run build:combined`.
4. Run Terraform phase 1 to create S3 + ACM request (`tf-apply-phase1.sh`).
5. Perform ACM DNS validation at your DNS provider.
6. Run full Terraform apply (`tf-apply.sh`) to create CloudFront and bucket policy.
7. Sync `combined/` to S3.
8. Configure DNS records manually for your provider using `cloudfront_domain_name`.

## Phase Model

- **Phase 1:** targeted apply for S3 + ACM request
- **Phase 2:** external DNS validation records for ACM
- **Phase 3:** full apply for runtime infra and distribution outputs
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

- Version: `v0.3.0`
- Last updated: `2026-05-06`
- Change class: reverted to CloudFront + S3 managed static hosting model.
