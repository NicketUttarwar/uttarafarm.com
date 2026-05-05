locals {
  primary_domain        = var.domain_names[0]
  resource_name_prefix  = substr("${var.project_name}-${var.environment}", 0, 24)
  route53_zone_dns_name = trimsuffix(var.route53_zone_name != "" ? var.route53_zone_name : local.primary_domain, ".")
  global_accelerator_ip_addresses = flatten([
    for ip_set in aws_globalaccelerator_accelerator.site.ip_sets : ip_set.ip_addresses
  ])
  route53_resolved_zone_id = (
    var.manage_route53_records ?
    (
      var.route53_zone_id != "" ? var.route53_zone_id :
      (
        var.create_route53_zone ?
        aws_route53_zone.public_managed[0].zone_id :
        data.aws_route53_zone.public_lookup[0].zone_id
      )
    ) :
    null
  )

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.common_tags
  )
}
