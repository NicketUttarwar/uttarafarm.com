locals {
  primary_domain       = var.domain_names[0]
  resource_name_prefix = substr("${var.project_name}-${var.environment}", 0, 24)

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.common_tags
  )
}
