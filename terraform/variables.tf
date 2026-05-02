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
