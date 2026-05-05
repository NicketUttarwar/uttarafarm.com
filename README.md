# uttarafarm.com

Static website for Uttara Farm (Vite + React + TypeScript + Tailwind), deployed on AWS with a GoDaddy-compatible apex DNS architecture.

## What changed

This repo now uses an architecture that ends with **static public IP addresses** so you can set apex records (`@`) in GoDaddy:

- Build artifact in `combined/`
- Private S3 bucket stores website files
- EC2 web nodes run nginx and pull site files from S3
- ALB terminates TLS with ACM cert
- AWS Global Accelerator fronts ALB and provides static Anycast IPs
- GoDaddy apex uses `A` records to those Global Accelerator IPs

## AWS architecture

`combined/ -> S3 (private) -> EC2/nginx -> ALB (HTTPS) -> Global Accelerator (static IPv4)`

## Domains and DNS

- Canonical domain: `uttarafarm.com`
- Optional: `www.uttarafarm.com`
- You can add both to `domain_names` in Terraform.

Because GoDaddy does not support apex CNAME to CloudFront, this stack outputs static IPs for apex `A` records.

## Prerequisites

- Node.js 18+
- npm
- Terraform 1.14.7
- AWS CLI v2
- `jq`

## Setup

1. `cp config/aws.env.example config/aws.env`
2. Edit `config/aws.env` with AWS credentials and `AWS_DEFAULT_REGION=us-east-1`
3. `cp config/terraform.tfvars.example config/terraform.tfvars`
4. Edit `config/terraform.tfvars`:
   - `site_bucket_name`
   - `domain_names`
   - `vpc_id`
   - `public_subnet_ids` (at least two public subnets in that VPC)
   - `web_ami_id` (an approved AMI in `us-east-1`, e.g. Amazon Linux 2023)
   - Route53 fields only if you want Terraform-managed Route53

## Deploy infrastructure

Run from repo root:

1. `./scripts/tf-version.sh`
2. `./scripts/tf-init.sh`
3. `./scripts/tf-fmt-validate.sh`
4. `./scripts/tf-plan.sh`

### Phase 1 (creates S3 + ACM cert request)

5. `./scripts/tf-apply-phase1.sh`

### Add ACM DNS validation records

6. `./scripts/tf-output.sh acm_validation_records`
7. Add all returned CNAMEs at your DNS provider
8. `./scripts/check-acm-dns.sh` until certificate status is `ISSUED`

### Full apply

9. `./scripts/tf-apply.sh`

## Build and publish site content

1. `npm install`
2. `npm run build:combined`
3. `aws s3 sync combined/ s3://<your-site_bucket_name> --delete`

Example:

`aws s3 sync combined/ s3://uttarafarm-website-bucket --delete`

No CloudFront invalidation is required in this architecture.

## GoDaddy apex DNS setup (critical)

After `./scripts/tf-apply.sh`, fetch static IPs:

- `./scripts/tf-output.sh global_accelerator_ip_addresses`

You will get two IPv4 addresses. In GoDaddy DNS:

1. Create `A` record for host `@` to IP #1
2. Create second `A` record for host `@` to IP #2
3. (Optional) `www` record:
   - either `CNAME www -> uttarafarm.com`
   - or two `A` records for `www` to the same two IPs

Recommended TTL: 600 seconds.

## Optional Route53-managed DNS

If you want Terraform to manage DNS in Route53 instead of GoDaddy records:

1. Set `route53_zone_id` (preferred), or `route53_zone_name`
2. `bash scripts/tf-apply-phase3-dns.sh`

That creates Route53 `A` records pointing all `domain_names` to Global Accelerator IPs.

Rollback Route53 DNS phase:

- `bash scripts/tf-destroy-phase3-dns.sh`

## Verify

Check:

- `https://uttarafarm.com/`
- `https://uttarafarm.com/story/`
- `https://uttarafarm.com/timeline/`
- `https://uttarafarm.com/impact/`
- `https://uttarafarm.com/how-we-work/`
- `https://uttarafarm.com/contact/`

## Useful outputs

- `./scripts/tf-output.sh global_accelerator_ip_addresses`
- `./scripts/tf-output.sh global_accelerator_dns_name`
- `./scripts/tf-output.sh alb_dns_name`
- `./scripts/tf-output.sh acm_validation_records`

## Local development

- `npm run dev`
- or `./scripts/test-local.sh`

## Terraform destroy

This destroys everything managed by Terraform (S3, EC2/ALB, Global Accelerator, ACM, Route53 managed records):

- `FORCE_DESTROY_ALL=true bash scripts/tf-destroy-all.sh`

## Repo structure

- `src/` app source
- `public/` static public assets
- `combined/` generated deploy artifact
- `terraform/` infrastructure
- `config/` local env and tfvars templates
- `scripts/` automation scripts
