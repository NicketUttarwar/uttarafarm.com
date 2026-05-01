
# Website Architecture and Deployment Guide

This document is a high-level and operational architecture reference for the entire repository, with emphasis on Terraform workflow, diagnostics, and production deployment on AWS in a single account.

It complements `README.md` by giving a system view first, then detailed conventions and best practices.

---

## 1) System Overview

This repository deploys one static website stack:

- Content source: `combined/`
- Infrastructure as code: `terraform/`
- Operational wrappers: `scripts/`
- Runtime platform: AWS (`us-east-1` only)
- DNS provider: external registrar/DNS host (Network Solutions in current flow)

### High-level request path

1. User requests `https://<your-domain>/path/`
2. DNS resolves hostname to CloudFront distribution (`*.cloudfront.net`)
3. CloudFront enforces HTTPS and serves cached object when available
4. Cache miss goes to S3 website endpoint origin (`bucket.s3-website-...amazonaws.com`) over HTTP
5. S3 website hosting resolves directory routes (`/about/` -> `about/index.html`)
6. CloudFront returns response and caches according to policy

### Why S3 website endpoint origin (not S3 REST API + OAC)

This repo is designed for static-site directory routing without edge rewrites:

- S3 website endpoint supports index document behavior for nested routes
- S3 REST API does not natively map directory paths to `index.html`
- Tradeoff: website endpoint requires public `s3:GetObject` bucket policy for objects

---

## 2) Build and Deploy Architecture

## Source and artifact model

- There is no build pipeline that compiles/transpiles assets for the primary site content.
- The deploy artifact is the folder tree in `combined/`, uploaded to S3 bucket root.
- Object key structure mirrors local path structure (for example, `combined/about/index.html` becomes `about/index.html` in S3).

## Infrastructure provisioning model

- Terraform provisions S3, ACM certificate resources, CloudFront distribution, and S3 bucket policy.
- Terraform state backend is local and stored at `terraform/state/terraform.tfstate`.
- State is intentionally committed to Git for this repo's operating model.

## Operational flow (canonical)

1. Configure local AWS credentials (`config/aws.env`)
2. Configure local Terraform variables (`config/terraform.tfvars`)
3. Confirm dedicated network inputs (`vpc_name`, `public_subnet_name`, `vpc_cidr_block`, `public_subnet_cidr_block`, `public_subnet_availability_zone`)
4. `./scripts/tf-init.sh`
5. `./scripts/tf-plan.sh`
6. `./scripts/tf-apply-phase1.sh` (creates dedicated VPC + public subnet baseline, plus S3 + ACM request, no DNS wait)
7. Add ACM validation CNAME records in DNS provider
8. Wait for ACM cert status `Issued`
9. `./scripts/tf-apply.sh` (CloudFront + validation + bucket policy)
10. `aws s3 sync combined/ s3://<bucket> --delete`
11. `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`

For exact command behavior and sequence details, `README.md` remains the source of truth.

---

## 3) Terraform Deep Dive

## Version and tool assumptions

- Terraform version is constrained by `terraform/versions.tf` (currently `~> 1.14.7`).
- Recommended local version management uses `tfenv`.
- `terraform` must be on `PATH`.
- AWS CLI v2 is required for content sync, invalidations, and diagnostics scripts that query AWS APIs.

Recommended local setup:

```bash
tfenv install 1.14.7
tfenv use 1.14.7
terraform version
aws --version
```

## State model and local state management

- Backend type: `local`
- State path: `terraform/state/terraform.tfstate`
- Session backup path: `terraform/state/session/latest.tfstate` (managed by wrapper logic)
- State is committed; secrets are not.

State-related best practices for this repo:

- Do not manually edit `.tfstate` JSON.
- Use wrapper scripts (`tf-*.sh`) so session restore/backup behavior stays consistent.
- Resolve state conflicts intentionally (state file is treated as binary to avoid unsafe auto-merges).
- Keep `config/aws.env` and `config/terraform.tfvars` uncommitted.

## Data/control dependencies

- Terraform execution depends on valid local AWS credentials.
- Terraform apply phase 2 depends on successful ACM DNS validation externally.
- Site availability depends on DNS records at registrar (outside Terraform scope in this repo).

## Environment and region defaults by service

This section captures both configured defaults and current deployed state so you can extend region research service-by-service.

### Environment defaults (from Terraform inputs)

- `environment` default: `personal` (from `terraform/variables.tf`)
- `environment` allowed values: `uttarwar-family`, `personal`, `independent-ventures`, `dev`
- `project_name` default: `website` (from `terraform/variables.tf`)
- `aws_region` default: `us-east-1` and currently validated to only allow `us-east-1`
- Runtime CLI expectation: `AWS_DEFAULT_REGION=us-east-1` in `config/aws.env`

### Region matrix (current stack)

- **S3 bucket (`aws_s3_bucket.site`)**: `us-east-1` (provider default and state)
- **S3 website configuration (`aws_s3_bucket_website_configuration.site`)**: `us-east-1`
- **S3 bucket policy (`aws_s3_bucket_policy.site`)**: `us-east-1`
- **S3 public access block (`aws_s3_bucket_public_access_block.site`)**: `us-east-1`
- **ACM certificate (`aws_acm_certificate.site`)**: `us-east-1` (required for CloudFront viewer cert attachment)
- **ACM certificate validation (`aws_acm_certificate_validation.site`)**: `us-east-1`
- **CloudFront distribution (`aws_cloudfront_distribution.site`)**: global edge service, managed via AWS API/provider in `us-east-1`

### State-derived evidence (current deployment)

From `terraform/state/terraform.tfstate`:

- Provider region recorded as `us-east-1`
- Resource types present:
  - `aws_acm_certificate`
  - `aws_acm_certificate_validation`
  - `aws_cloudfront_distribution`
  - `aws_s3_bucket`
  - `aws_s3_bucket_policy`
  - `aws_s3_bucket_public_access_block`
  - `aws_s3_bucket_website_configuration`

### How to evolve this for region research

When you determine a better region strategy per service, update these controls together:

1. `terraform/variables.tf` (`aws_region` validation and default)
2. `terraform/providers.tf` (provider region and any provider aliases if introduced)
3. `README.md` region notes and deployment steps
4. This section's service matrix with "preferred region" and rationale

Suggested extension format:

- `Service`: CloudFront control plane
- `Current region`: `us-east-1`
- `Preferred region`: `<your research>`
- `Reason`: feature availability, latency, compliance, or cost
- `Migration impact`: low/medium/high + required actions

## Resource composition

- `aws_vpc.site`
- `aws_subnet.site_public`
- `aws_internet_gateway.site`
- `aws_route_table.site_public`
- `aws_route_table_association.site_public`
- `aws_s3_bucket.site`
- `aws_s3_bucket_website_configuration.site`
- `aws_s3_bucket_public_access_block.site`
- `aws_s3_bucket_policy.site` (public object read for website endpoint architecture)
- `aws_acm_certificate.site`
- `aws_acm_certificate_validation.site`
- `aws_cloudfront_distribution.site`

## Tagging and defaults

Default tags are set centrally via provider `default_tags`:

- `Project = var.project_name`
- `ManagedBy = terraform`
- `Environment = var.environment`
- plus `var.common_tags`

These tags are merged in `terraform/locals.tf` and applied to taggable resources.

---

## 4) DNS and External Vendor Architecture

DNS is intentionally external to AWS (Network Solutions in current docs). Two independent DNS workflows exist:

1. **ACM validation DNS records** (proves domain ownership to AWS)
2. **Website traffic DNS records** (routes visitors to CloudFront)

Do not mix the two record sets.

## External dependencies in this repo

- Network Solutions (or equivalent registrar/DNS host): authoritatively manages DNS zone records
- AWS ACM: certificate issuance and renewal tied to DNS validation records

## Apex and `www` model

- `www` should be CNAME to CloudFront domain
- Apex should use registrar forwarding to `www` or an ALIAS/ANAME equivalent if available

Refer to `README.md` for provider-specific UI instructions.

---

## 5) Diagnostics and Operational Runbook

Use this section to diagnose failures end-to-end.

## A. Terraform and state health

- `./scripts/tf-version.sh`
- `./scripts/tf-fmt-validate.sh`
- `./scripts/tf-init.sh`
- `./scripts/tf-plan.sh`
- `./scripts/tf-show.sh`
- `./scripts/tf-state.sh list`

When state appears inconsistent with AWS resources:

- Run `./scripts/tf-refresh.sh`
- Re-plan (`./scripts/tf-plan.sh`) and review drift
- Use `tf-import.sh` or state commands only when needed and reviewed

## B. Certificate and DNS validation

- `./scripts/tf-output.sh` for `acm_validation_records`
- `./scripts/check-acm-dns.sh` for ACM console guidance
- Verify exact CNAME names/values in DNS host

If certificate remains `Pending validation`, root causes are usually:

- Wrong DNS zone edited
- Typo/copy error in CNAME host/value
- Insufficient propagation time

## C. CloudFront and origin checks

- `./scripts/tf-output.sh` for `cloudfront_domain_name`, `cloudfront_distribution_id`, `s3_website_endpoint`
- Validate CloudFront origin matches S3 website endpoint style
- Invalidate cache after content updates

## D. Content and routing checks

- Verify expected file keys exist (for example `about/index.html`, `404.html`)
- Sync with `aws s3 sync ... --delete`
- Test:
  - `/`
  - nested route (`/about/`)
  - missing route (expects custom `404.html`)

---

## 6) Billing and Cost Attribution Standard

Goal: from AWS Billing/Cost Explorer, identify spend for this website stack quickly and reliably.

## Required tagging policy

At minimum, enforce these tags on all taggable resources:

- `Project`: stable stack identifier (for example `website`)
- `Environment`: one of `uttarwar-family`, `personal`, `independent-ventures`, `dev`
- `ManagedBy`: `terraform`
- `Owner`: human/team owner (recommended via `common_tags`)
- `CostCenter`: finance or internal budget code (recommended via `common_tags`)

For cost attribution, treat `Project` + `Environment` as a required pair for all dashboards, budgets, and anomaly monitors.

Example in `config/terraform.tfvars`:

```hcl
project_name = "website"
environment  = "personal"
common_tags = {
  Owner      = "nicket"
  CostCenter = "personal-web"
}
```

## Billing configuration checklist (AWS account level)

In the same AWS account used for this repo:

1. Activate cost allocation tags in Billing console for:
   - `Project`, `Environment`, `ManagedBy`, `Owner`, `CostCenter`
2. Wait for tags to appear in Cost Explorer datasets (can take up to 24 hours)
3. Create Cost Explorer saved views grouped by `Project` and `Environment`
4. Create monthly budget filtered by tags `Project=website` and `Environment=personal` (or your selected environment)
5. (Recommended) Configure AWS Cost Anomaly Detection monitor scoped by both `Project` and `Environment`

## Practical repo-level usage

- Use `./scripts/list-tagged-resources.sh` to list resources by tag (`Project` by default).
- For cost checks by environment, run with explicit filters (for example `TAG_KEY=Environment TAG_VALUE=personal ./scripts/list-tagged-resources.sh`).
- Keep `project_name` stable after initial deployment; changing it can fragment cost history across tag values.
- Keep `environment` stable for long-lived stacks so monthly cost trends remain comparable.
- If a tag value changes intentionally, coordinate with finance reporting windows.

---

## 7) Security and Reliability Best Practices (Single Account)

## Credentials and local machine

- Use least-privilege IAM where possible; `AdministratorAccess` can be used for initial bootstrap but should be tightened later.
- Never commit `config/aws.env`.
- Rotate access keys periodically or prefer short-lived credentials where practical.

## Infrastructure safety

- Always run `tf-plan.sh` before apply.
- Prefer two-phase apply for first-time domain setup (`tf-apply-phase1.sh` then full apply).
- Use `destroy-stack.sh` for controlled teardown, not ad-hoc deletes in console.

## Change management

- Treat Terraform state updates as sensitive infra changes.
- Keep resource naming and tag strategy stable to preserve monitoring and billing continuity.
- Use CloudFront invalidation sparingly for cost control; invalidate only changed paths when possible.

---

## 8) Naming, Searchability, and Built-in Version Control

This repo should follow a deterministic naming model so resources, files, and release changes are easy to locate in AWS, Git history, and search tools.

## Naming schema (required)

Use lowercase kebab-case for folder/file identifiers unless platform rules require a different format.

### A. Terraform input identity

- `project_name`: stable project slug (example: `website`)
- `environment`: stable environment slug (example: `personal`)
- `aws_region`: fixed to `us-east-1` in this stack
- `vpc_name`: dedicated network identifier (example: `website-vpc`)
- `public_subnet_name`: dedicated public subnet identifier (example: `website-public-subnet`)

These values are the canonical identity anchors for naming, tags, cost filtering, and search.

### B. AWS resource naming pattern

Where resource names are configurable, use:

`<project>-<environment>-<service>-<purpose>`

Examples:

- `website-personal-s3-origin`
- `website-personal-cf-site`
- `website-personal-acm-primary`

For globally unique names (for example S3 buckets), append a short deterministic suffix:

`<project>-<environment>-<purpose>-<account-or-random-suffix>`

Example:

- `website-personal-site-123456789012`

### C. Repository file naming pattern

- Markdown specs/docs: `<domain>-<topic>.md` (example: `deploy-runbook.md`)
- Scripts: verb-noun style with shell suffix (example: `sync-assets.sh`)
- Long-lived architecture docs: stable names (`ARCHITECTURE.md`, `README.md`)

Avoid ad-hoc names like `newfile.md`, `temp.sh`, or mixed case variants that reduce grep/search reliability.

## Searchability standards

- One concept, one canonical location (avoid duplicated operational instructions across many files).
- Keep key terms consistent (`project_name`, `domain_names`, `cloudfront_distribution_id`).
- Prefer predictable prefixes in docs and scripts so `rg` queries are straightforward.

## Built-in version control model

This repo uses Git as the source of truth for both infrastructure intent and architecture documentation.

Required controls:

- All architectural changes must be committed in the same PR/change set as related Terraform/script changes.
- `ARCHITECTURE.md` should include a short "Document Version" block updated when standards change.
- New versioned docs/standards should start at the default baseline version `0.1.0`.
- Use annotated Git tags for deployment milestones (example: `deploy-personal-2026-04-29`).
- Preserve Terraform state history through normal commits (do not rewrite shared history for infra runs).

### Document Version

- Version: `v0.1.0`
- Last updated: `2026-04-29`
- Change class: cost tagging requires environment pairing

---

## 9) Scope Boundaries and Responsibilities

Terraform in this repo manages AWS website infrastructure and outputs deployment targets.

Not managed by Terraform here:

- Registrar account and DNS UI operations
- Domain ownership lifecycle and renewal
- Business-level billing governance setup in AWS Billing console

Operational ownership should explicitly cover both sides:

- AWS infra ownership (Terraform + AWS console)
- DNS/vendor ownership (Network Solutions account access)

---

## 10) Quick Reference

- Main deployment guide: `README.md`
- Static site content overview: `combined/README.md`
- Terraform module: `terraform/`
- Terraform wrappers: `scripts/`
- Cost/asset discovery by tag: `scripts/list-tagged-resources.sh`

---

## 11) AI and LLM Readability Architecture

The website should remain human-friendly and machine-readable for search engines, AI crawlers, and LLM retrieval systems.

### Required discovery and policy files at site root

Publish and maintain these files at the production site root:

- `robots.txt`: crawler access policy and sitemap location
- `sitemap.xml`: canonical URL inventory for discovery and recrawl
- `llms.txt`: concise high-signal summary of site purpose, key pages, and usage constraints

Optional compatibility alias:

- `llm.txt` redirect or duplicate pointing to `llms.txt`

### Operational behavior standards

- Keep crawler metadata files cache-aware but frequently refreshable (short CloudFront TTL).
- Regenerate `sitemap.xml` when public URLs change.
- Ensure `robots.txt` does not unintentionally block important public routes or static assets.
- Keep `llms.txt` concise, factual, and consistent with current production content.

### AI compatibility best practices for static pages

- Use stable canonical URLs and avoid duplicate content served from multiple paths.
- Preserve semantic HTML structure (`main`, heading hierarchy, lists, table semantics where needed).
- Include accurate page metadata (`title`, description, canonical URL, Open Graph where applicable).
- Prefer static/server-rendered primary content; avoid hiding critical meaning behind client-only interactions.
- Maintain clean HTTP behavior (200 for valid routes, explicit 404/410 for missing routes, predictable redirects).
- Version important policy and governance pages clearly to support reliable citation.
- Minimize broken links and keep internal navigation explicit so crawlers and retrieval systems can traverse content.


