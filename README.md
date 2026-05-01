# uttarafarm.com

Static marketing site for Uttara Farm (Vite + React + TypeScript + Tailwind) with a Path B deployment model:

- Source of truth: `src/`
- Build output: `dist/`
- Deploy artifact: `combined/`
- Runtime: S3 website endpoint behind CloudFront

## Domains (canonical deploy)

This repository deploys **one** static website: a **single** S3 bucket and **one** CloudFront distribution. There is no multi-distribution or multi-bucket setup in Terraform for different hostnames.

**Canonical production hostname:** **`uttarafarm.com`** (and **`www`** if you use it in DNS). The steps in this README—build, `aws s3 sync`, CloudFront invalidation, and the Terraform modules in `terraform/`—all target that stack only.

Uttara Farm uses **five** domains that should present the **same** site to visitors. Only **`uttarafarm.com`** is backed by this repo’s CloudFront + S3 deploy. Point the others to the canonical URL with **HTTP redirects or DNS forwarding at your registrar or DNS provider**; you do **not** need extra CloudFront alternate domain names or Terraform changes here for those names.

| Role | Hostname |
| --- | --- |
| Canonical (this deploy) | `uttarafarm.com` |
| Forward to canonical (registrar/DNS only) | `uttarafarm.in`, `uttarafarms.com`, `uttarafarms.in`, `uttara.farm` |

## Stack

| Layer | Choices |
| --- | --- |
| UI | React 19 + TypeScript |
| Routing | react-router-dom 7 |
| Build | Vite 6 |
| Styles | Tailwind CSS 4 (`@tailwindcss/vite`) |

## Documentation

Beyond this README:

- [`ARCHITECTURE.md`](ARCHITECTURE.md): Path B phases, tagging, deployment workflow at repo level.
- [`GLOBAL_ARCHITECTURE.md`](GLOBAL_ARCHITECTURE.md): End-to-end system view (build → AWS, CloudFront ↔ S3 website endpoint, diagnostics).
- [`DEVICE_LANGUAGE_DEFAULTS.md`](DEVICE_LANGUAGE_DEFAULTS.md): Default locale rules (manual choice vs device hints).

## Dependencies

- Node.js 18+ and npm (`package-lock.json` is the pinned tree for JS dependencies)
- Terraform 1.14.7 (`tfenv` recommended)
- AWS CLI v2
- Python 3 (optional; used by `scripts/test-local.sh`)

## Host the website (individual steps)

Run these **in order** the first time you stand up hosting. Region is **`us-east-1`** everywhere in this repo unless you deliberately change tooling and Terraform constraints.

### 0 — Install tooling (once per machine)

1. Install **Node.js 18+** and **npm** (`node --version`, `npm --version`).
2. Install **Terraform 1.14.7** (`terraform version`). With `tfenv`:

   ```bash
   tfenv install 1.14.7
   tfenv use 1.14.7
   ```

3. Install **AWS CLI v2** (`aws --version`).
4. Clone this repository and **`cd`** into its root (`uttarafarm.com`).

### 1 — App install

5. **`npm install`**

### 2 — Local secrets and Terraform variables

Do **not** commit **`config/aws.env`** or **`config/terraform.tfvars`** (they contain secrets and environment-specific naming).

6. **`cp config/aws.env.example config/aws.env`**
7. Edit **`config/aws.env`**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION=us-east-1`.
8. **`cp config/terraform.tfvars.example config/terraform.tfvars`**
9. Edit **`config/terraform.tfvars`**. At minimum set `site_bucket_name`, `domain_names`, and network fields (`vpc_name`, `public_subnet_name`, `vpc_cidr_block`, `public_subnet_cidr_block`, `public_subnet_availability_zone`). Use the examples in [`config/terraform.tfvars.example`](config/terraform.tfvars.example) as a guide.

### 3 — Terraform: version check, init, validate, phase-1 apply

All Terraform wrappers load **`config/aws.env`** automatically; plain `aws`/`terraform` CLI commands elsewhere do not unless you export them yourself (step **22**).

From the repo root, if **`./scripts/...` is denied because the file is not executable**, fix once:

**`chmod +x scripts/*.sh`**

10. **`./scripts/tf-version.sh`**
11. **`./scripts/tf-init.sh`**
12. **`./scripts/tf-fmt-validate.sh`**
13. **`./scripts/tf-plan.sh`**
14. **`./scripts/tf-apply-phase1.sh`** — constrained `terraform apply` with **`-target`** for **S3** (bucket, website hosting, public access block, bucket policy) and **ACM certificate request**. CloudFront and any remaining stack resources (**step 18**) wait until ACM can validate successfully.

### 4 — ACM: DNS validation records (manual registrar / DNS UI)

15. Inspect validation requirements (JSON):

    **`./scripts/tf-output.sh acm_validation_records`**

    Read the emitted JSON (for example with `jq`) or use **AWS Certificate Manager** in **`us-east-1`** — every ACM validation **CNAME** must exist at your DNS provider.
16. **At your DNS host** (e.g. Network Solutions), create **all** ACM validation **CNAME** records exactly as AWS specifies.
17. Poll until ACM issues the cert:

    **`./scripts/check-acm-dns.sh`**

    Repeat step 17 until **`Status`** is **`ISSUED`** (propagation may take minutes between attempts).

### 5 — Terraform: full apply

18. **`./scripts/tf-apply.sh`** — brings up the rest of the stack (CloudFront distribution, ACM validation attachments, bucket policy wiring, etc. per Terraform).

### 6 — Capture CloudFront + bucket names for DNS and deploy CLI

19. **`./scripts/tf-output.sh cloudfront_domain_name`** — target for **`www`** CNAME once you cut over traffic.

    Example (raw hostname only; often you want `.` suffix in DNS UI):

    ```bash
    cd terraform && terraform output -raw cloudfront_domain_name && cd ..
    ```

20. **`./scripts/tf-output.sh cloudfront_distribution_id`** — distribution id for **`aws cloudfront create-invalidation`** below.

Use the **same bucket name as `site_bucket_name`** in **`config/terraform.tfvars`** for `aws s3 sync` (`terraform/state` may mirror it).

### 7 — Build the static artifact

21. **`npm run build:combined`** — refreshes **`combined/`** (see [Build and artifact generation](#build-and-artifact-generation)).

### 8 — Load AWS credentials for raw `aws` CLI

Terraform scripts already **`source`** `config/aws.env`. **`aws s3`** and **`aws cloudfront`** use your shell unless you configured a profile instead.

22. Export credentials **for your current terminal only** if you rely on **`config/aws.env`**:

    ```bash
    set -a && source config/aws.env && set +a
    ```

### 9 — Publish to S3

23. **`aws s3 sync combined/ s3://YOUR_SITE_BUCKET --delete`** — substitute **`YOUR_SITE_BUCKET`** with **`site_bucket_name`** from **`config/terraform.tfvars`**.

### 10 — Invalidate CloudFront cache

24. **`aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"`** — use the id from step 20.

### 11 — Public DNS (traffic to CloudFront)

25. For **`uttarafarm.com`** (canonical), **`www`** **→** **CNAME** to the **`cloudfront_domain_name`** hostname from step 19 (omit `https://` in DNS).
26. **Apex (`@`)** for the canonical zone → registrar **HTTP redirect** to `www` **or** your provider’s **ALIAS/ANAME** to the same CloudFront target, per registrar docs.
27. For **`uttarafarm.in`**, **`uttarafarms.com`**, **`uttarafarms.in`**, and **`uttara.farm`**, configure **redirect/forward** to **`uttarafarm.com`** at the registrar or DNS only (see [Domains (canonical deploy)](#domains-canonical-deploy)); no CloudFront or Terraform updates in this repo.

### 12 — Verify

Open in a browser (replace `<domain>` with your live hostname):

- `https://<domain>/`
- `https://<domain>/story/`
- `https://<domain>/timeline/`
- `https://<domain>/impact/`
- `https://<domain>/how-we-work/`
- `https://<domain>/contact/`
- Unknown path → custom **404** page

### Subsequent deploys (content change only — infra unchanged)

When S3 bucket and CloudFront already exist:

1. **`npm run build:combined`**
2. **`set -a && source config/aws.env && set +a`** (if not already loaded)
3. **`aws s3 sync combined/ s3://YOUR_SITE_BUCKET --delete`**
4. **`aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"`**

## Local Development

```bash
npm install
npm run dev
```

Convenience script:

```bash
./scripts/test-local.sh
```

`./scripts/test-local.sh` ensures a local `.venv` exists (Python 3; optional packages only if listed in [`requirements.txt`](requirements.txt)), installs npm deps if needed, binds Vite to **127.0.0.1:9999** with `--strictPort`, opens the browser, and tears down on exit (`Ctrl+C`).

For the default dev server (`npm run dev`), Vite chooses host/port from its defaults. Use `npm run test:local` when you want the scripted flow (fixed port **9999**, optional Python `.venv`). After `npm run build`, use `npm run preview` to sanity-check production output locally.

## Build and Artifact Generation

```bash
npm run build:combined
```

What this does:

1. Runs TypeScript project build (`tsc -b`) plus `vite build` into `dist/`
2. Copies `dist/` into `combined/` (see [`scripts/generate-combined.sh`](scripts/generate-combined.sh))
3. Creates directory-index entrypoints (`<route>/index.html`) so the S3 website host can resolve trailing-slash paths without SPA hacks:
   - `/timeline/`, `/story/`, `/impact/`, `/contact/`, `/how-we-work/`
4. Copies `/llms.txt` to `/llm.txt` alias in `combined/`

`combined/` is the folder to sync to S3.

## App routes (`src/App.tsx`)

| Path | Renders |
| --- | --- |
| `/` | Home |
| `/story`, `/timeline`, `/impact` | Story / About (`About.tsx`) |
| `/how-we-work` | How we work (`HowWeWork.tsx` → [`src/how-we-work/`](src/how-we-work/)) |
| `/contact` | Contact |
| `*` | Custom 404 (`NotFound.tsx`) |

String assets for the `/how-we-work` page live in [`src/how-we-work/copy.en.json`](src/how-we-work/copy.en.json) and [`src/how-we-work/copy.mr.json`](src/how-we-work/copy.mr.json).

## Internationalization

- Strings: [`src/locales/en.json`](src/locales/en.json) and [`src/locales/mr.json`](src/locales/mr.json).
- Wiring: [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx) (`t()`, `locale`, `setLocale`). Manual preference is stored in `localStorage` under `uttarafarm-locale` and overrides device defaults.

See [`DEVICE_LANGUAGE_DEFAULTS.md`](DEVICE_LANGUAGE_DEFAULTS.md) for Android vs iOS default locale behavior on first visit.

## Path B model (reference)

The numbered sequence in [Host the website (individual steps)](#host-the-website-individual-steps) is Path B:

- Terraform **phase 1**: `./scripts/tf-apply-phase1.sh` provisions **S3** + requests **ACM**, using **`-target`** so CloudFront-heavy resources wait until ACM validation CNAMEs exist (see [`scripts/tf-apply-phase1.sh`](scripts/tf-apply-phase1.sh)).
- **External DNS**: ACM validation CNAMEs at your DNS provider; `./scripts/check-acm-dns.sh` polls status.
- Terraform **phase 2**: `./scripts/tf-apply.sh` applies the remainder (CloudFront, validation completion, wiring).
- **Content**: **`combined/` → S3** then **CloudFront invalidation**. Public traffic uses registrar DNS (**`www` CNAME → CloudFront**; apex per provider).

Debugging output (when defined in Terraform): **`./scripts/tf-output.sh s3_website_endpoint`** for the bare S3 website hostname (distinct from CloudFront).

### Rollback

1. Re-sync a previous known-good **`combined/`** tree to **`s3://YOUR_SITE_BUCKET`**
2. Run **`aws cloudfront create-invalidation`** for **`"/*"`** or only the impacted paths.
3. If DNS cutover was wrong, restore the registrar’s previous target.

### Governance and ongoing operations

- Keep tag set on resources:
  - `Project`
  - `Environment`
  - `ManagedBy`
  - optional: `Owner`, `CostCenter`
- Keep dedicated network naming and CIDR settings documented and stable:
  - `vpc_name`, `public_subnet_name`
  - `vpc_cidr_block`, `public_subnet_cidr_block`
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

## Repo layout (high level)

- `src/` — React application
- `public/` — Static files emitted at site root (`robots.txt`, `sitemap.xml`, assets, etc.)
- `diagrams/` — LaTeX source for the entity diagram SVG
- `combined/` — **generated** deploy tree (gitignored typical); do not edit by hand
- `terraform/` — Infrastructure-as-code consumed by `./scripts/tf-*.sh` (see [`GLOBAL_ARCHITECTURE.md`](GLOBAL_ARCHITECTURE.md))
- `config/` — Local-only templates for AWS/Terraform vars (see Phase 1 in the Path B runbook)
- `scripts/` — Build helpers, Terraform wrappers, ACM checks

## How We Work Diagram (LaTeX)

The `/how-we-work` page uses an SVG diagram rendered from:

- `diagrams/how-we-work-entity-diagram.tex`

To regenerate the SVG after editing the LaTeX source:

```bash
./scripts/render-how-we-work-diagram.sh
```

This updates:

- `public/assets/how-we-work-entity-diagram.svg`
