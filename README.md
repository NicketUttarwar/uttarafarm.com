# uttarafarm.com

Static marketing site for Uttara Farm (Vite + React + TypeScript + Tailwind) with a Path B deployment model:

- Source of truth: `src/`
- Build output: `dist/`
- Deploy artifact: `combined/`
- Runtime: S3 website endpoint behind CloudFront

## Dependencies

- Node.js 18+ and npm
- Terraform 1.14.7 (`tfenv` recommended)
- AWS CLI v2
- Python 3 (optional; used by `scripts/test-local.sh`)

## Local Development

```bash
npm install
npm run dev
```

Convenience script:

```bash
./scripts/test-local.sh
```

## Build and Artifact Generation

```bash
npm run build:combined
```

What this does:

1. Builds the app into `dist/`
2. Copies `dist/` into `combined/`
3. Creates directory-index entrypoints for canonical routes:
   - `/timeline/`
   - `/story/`
   - `/impact/`
   - `/contact/`
4. Copies `/llms.txt` to `/llm.txt` alias in `combined/`

`combined/` is the folder to upload to S3.

## Path B Phased Runbook

### Phase 1: Local Repo Readiness

1. Copy config templates:
   - `cp config/aws.env.example config/aws.env`
   - `cp config/terraform.tfvars.example config/terraform.tfvars`
2. Fill real values in:
   - `config/aws.env`
   - `config/terraform.tfvars`
3. Build deploy artifact:
   - `npm run build:combined`

### Phase 2: Provision AWS Infrastructure

Run in order:

```bash
./scripts/tf-version.sh
./scripts/tf-init.sh
./scripts/tf-fmt-validate.sh
./scripts/tf-plan.sh
./scripts/tf-apply-phase1.sh
```

Phase 1 apply creates S3 website resources and requests ACM certificate, but does not assume DNS is ready.

### Phase 3: External DNS Validation and Cutover Prep

After `tf-apply-phase1.sh`:

1. Get ACM DNS records:
   - `./scripts/tf-output.sh acm_validation_records`
2. Add all ACM CNAME records at your external DNS provider (for example Network Solutions).
3. Check issuance until `Issued`:
   - `./scripts/check-acm-dns.sh`
4. When issued, complete stack:
   - `./scripts/tf-apply.sh`
5. Get CloudFront details:
   - `./scripts/tf-output.sh cloudfront_domain_name`
   - `./scripts/tf-output.sh cloudfront_distribution_id`

Traffic DNS model:

- `www` -> CNAME to CloudFront domain
- apex -> registrar forwarding to `www` or provider ALIAS/ANAME equivalent

### Phase 4: Deploy and Verify

Deploy:

```bash
npm run build:combined
aws s3 sync combined/ s3://<site_bucket_name> --delete
aws cloudfront create-invalidation --distribution-id <distribution_id> --paths "/*"
```

Smoke tests:

- `https://<domain>/`
- `https://<domain>/story/`
- `https://<domain>/timeline/`
- `https://<domain>/impact/`
- `https://<domain>/contact/`
- missing route should return custom 404 page

Rollback:

1. Re-sync previous known-good artifact to S3
2. Invalidate only impacted paths (or `/*` for full rollback)
3. If DNS cutover caused issues, revert DNS target to prior endpoint

### Phase 5: Governance and Ongoing Operations

- Keep tag set on resources:
  - `Project`
  - `Environment`
  - `ManagedBy`
  - optional: `Owner`, `CostCenter`
- List tagged resources:
  - `./scripts/list-tagged-resources.sh`
  - `TAG_KEY=Environment TAG_VALUE=personal ./scripts/list-tagged-resources.sh`
- Use `./scripts/tf-refresh.sh` and `./scripts/tf-plan.sh` for drift checks
- Keep architecture docs/versioning aligned with infra changes

## AI/LLM Compatibility Files

Published at site root through `public/`:

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/llm.txt` (compatibility alias, produced during `build:combined`)

Update these whenever public routes or site purpose change.

## How We Work Diagram (LaTeX)

The `/how-we-work` page uses an SVG diagram rendered from:

- `diagrams/how-we-work-entity-diagram.tex`

To regenerate the SVG after editing the LaTeX source:

```bash
./scripts/render-how-we-work-diagram.sh
```

This updates:

- `public/assets/how-we-work-entity-diagram.svg`
