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
  description = "Primary and alternate domain names for CloudFront and ACM."
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

variable "vpc_name" {
  description = "Name tag for the dedicated website VPC."
  type        = string
  default     = "website-vpc"
}

variable "public_subnet_name" {
  description = "Name tag for the dedicated website public subnet."
  type        = string
  default     = "website-public-subnet"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the dedicated website VPC."
  type        = string
  default     = "10.50.0.0/16"
}

variable "public_subnet_cidr_block" {
  description = "CIDR block for the dedicated website public subnet."
  type        = string
  default     = "10.50.1.0/24"
}

variable "public_subnet_availability_zone" {
  description = "Availability zone for the dedicated website public subnet."
  type        = string
  default     = "us-east-1a"
}
