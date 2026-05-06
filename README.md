# uttarafarm.com

Static website for Uttara Farm (Vite + React + TypeScript + Tailwind), deployed on AWS using S3 + CloudFront.

## AWS architecture

`combined/ -> S3 (private) -> CloudFront (HTTPS)`

## Domains and DNS

- Canonical domain: `uttarafarm.com`
- Optional: `www.uttarafarm.com`
- Add both to `domain_names` in Terraform.
- This repo does **not** provision Route53 records.

## Prerequisites

- Node.js 18+
- npm
- Terraform 1.14.7
- AWS CLI v2
- `jq`

## Complete deploy flow (copy-paste)

Run all commands from the repository root.

### 1) Create local config files

```bash
cp config/aws.env.example config/aws.env
cp config/terraform.tfvars.example config/terraform.tfvars
```

### 2) Fill AWS credentials and region

Edit `config/aws.env` and set real values:

```bash
AWS_ACCESS_KEY_ID=REPLACE_ME
AWS_SECRET_ACCESS_KEY=REPLACE_ME
AWS_DEFAULT_REGION=us-east-1
```

### 3) Fill Terraform variables

Edit `config/terraform.tfvars` and set real values:

```hcl
project_name     = "uttarafarm"
environment      = "independent-ventures"
aws_region       = "us-east-1"
site_bucket_name = "uttarafarm-website-bucket"
domain_names     = ["uttarafarm.com", "www.uttarafarm.com"]

common_tags = {
  Owner      = "nicket"
  CostCenter = "uttarafarm-web"
}
```

### 4) Initialize and validate Terraform

```bash
./scripts/tf-version.sh
./scripts/tf-init.sh
./scripts/tf-fmt-validate.sh
./scripts/tf-plan.sh
```

### 5) Apply phase 1 (S3 + ACM certificate request)

```bash
./scripts/tf-apply-phase1.sh
```

### 6) Add ACM DNS validation records

Get validation CNAME records:

```bash
./scripts/tf-output.sh acm_validation_records
```

Add the returned CNAMEs in your DNS provider, then check status:

```bash
./scripts/check-acm-dns.sh
```

Repeat the status command until certificate `Status` is `ISSUED`.

### 7) Apply full infrastructure

```bash
./scripts/tf-apply.sh
```

### 8) Build and upload website content

```
aws s3 sync combined/ "s3://uttarafarm-website-bucket" --delete
```

### 9) Invalidate CloudFront cache

Invalidate all cached paths (recommended after each deploy):

```
aws cloudfront create-invalidation --distribution-id "E2PT8PD4NYQX5K" --paths "/*"
```

### 10) Configure GoDaddy apex + www to CloudFront

Get the CloudFront domain:

```bash
./scripts/tf-output.sh cloudfront_domain_name
```

Then configure apex and `www` in GoDaddy using:

- [How to point GoDaddy apex domain to CloudFront](https://getintokube.com/how-to-point-godaddy-apex-domain-to-cloudfront)

### 11) Verify routes

```bash
curl -I https://uttarafarm.com/
curl -I https://uttarafarm.com/story/
curl -I https://uttarafarm.com/timeline/
curl -I https://uttarafarm.com/impact/
curl -I https://uttarafarm.com/how-we-work/
curl -I https://uttarafarm.com/contact/
```

## Useful Terraform outputs

```bash
./scripts/tf-output.sh cloudfront_distribution_id
./scripts/tf-output.sh cloudfront_domain_name
./scripts/tf-output.sh cloudfront_hosted_zone_id
./scripts/tf-output.sh acm_validation_records
```

## Local development

```bash
npm run dev
```

or

```bash
./scripts/test-local.sh
```

## Terraform destroy

This destroys everything managed by Terraform (S3, CloudFront, ACM):

```bash
FORCE_DESTROY_ALL=true bash scripts/tf-destroy-all.sh
```

## Repo structure

- `src/` app source
- `public/` static public assets
- `combined/` generated deploy artifact
- `terraform/` infrastructure
- `config/` local env and tfvars templates
- `scripts/` automation scripts
