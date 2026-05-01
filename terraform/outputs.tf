output "project_name" {
  value = var.project_name
}

output "environment" {
  value = var.environment
}

output "vpc_id" {
  value = aws_vpc.site.id
}

output "public_subnet_id" {
  value = aws_subnet.site_public.id
}

output "public_route_table_id" {
  value = aws_route_table.site_public.id
}

output "site_bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.site.website_endpoint
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.site.domain_name
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
