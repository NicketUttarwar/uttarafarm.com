variable "project_name" {
  description = "Stable project slug used in tags and naming."
  type        = string
  default     = "website"
}

variable "environment" {
  description = "Deployment environment identifier."
  type        = string
  default     = "personal"

  validation {
    condition = contains(
      ["uttarwar-family", "personal", "independent-ventures", "dev"],
      var.environment
    )
    error_message = "environment must be one of uttarwar-family, personal, independent-ventures, dev."
  }
}

variable "aws_region" {
  description = "AWS region for this stack."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = var.aws_region == "us-east-1"
    error_message = "aws_region must remain us-east-1 for this stack."
  }
}

variable "domain_names" {
  description = "Primary and alternate domain names for Global Accelerator + ALB and ACM."
  type        = list(string)
}

variable "site_bucket_name" {
  description = "Globally unique S3 bucket name for website artifact hosting."
  type        = string
}

variable "common_tags" {
  description = "Optional organization-specific tags merged onto all resources."
  type        = map(string)
  default     = {}
}

variable "manage_route53_records" {
  description = "When true, Terraform manages Route53 A records to Global Accelerator static IPs."
  type        = bool
  default     = false
}

variable "route53_zone_name" {
  description = "Public Route53 zone name (apex), for example uttarafarm.com."
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Optional Route53 hosted zone ID. Preferred when known to avoid name lookups."
  type        = string
  default     = ""
}

variable "create_route53_zone" {
  description = "When true, create a new public Route53 hosted zone using route53_zone_name."
  type        = bool
  default     = false
}

variable "web_instance_type" {
  description = "EC2 instance type for web nodes behind the ALB."
  type        = string
  default     = "t3.micro"
}

variable "vpc_id" {
  description = "VPC ID where ALB and web nodes will run."
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for ALB and web nodes."
  type        = list(string)
}

variable "web_ami_id" {
  description = "AMI ID for web instances (for example latest Amazon Linux 2023 AMI in your region)."
  type        = string
}

variable "web_desired_capacity" {
  description = "Desired number of web instances."
  type        = number
  default     = 1
}

variable "web_min_size" {
  description = "Minimum number of web instances."
  type        = number
  default     = 1
}

variable "web_max_size" {
  description = "Maximum number of web instances."
  type        = number
  default     = 2
}
