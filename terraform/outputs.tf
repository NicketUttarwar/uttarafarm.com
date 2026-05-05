output "project_name" {
  value = var.project_name
}

output "environment" {
  value = var.environment
}

output "site_bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "s3_website_endpoint" {
  value = aws_s3_bucket.site.bucket_regional_domain_name
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.site.arn
}

output "acm_validation_records" {
  value = [
    for option in aws_acm_certificate.site.domain_validation_options : {
      domain_name  = option.domain_name
      record_name  = option.resource_record_name
      record_type  = option.resource_record_type
      record_value = option.resource_record_value
    }
  ]
}

output "route53_zone_id" {
  value = var.manage_route53_records ? local.route53_resolved_zone_id : null
}

output "route53_name_servers" {
  value = var.manage_route53_records && var.create_route53_zone ? aws_route53_zone.public_managed[0].name_servers : null
}

output "alb_dns_name" {
  value = aws_lb.site.dns_name
}

output "global_accelerator_dns_name" {
  value = aws_globalaccelerator_accelerator.site.dns_name
}

output "global_accelerator_ip_addresses" {
  value = local.global_accelerator_ip_addresses
}
