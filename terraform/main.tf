resource "aws_s3_bucket" "site" {
  bucket = var.site_bucket_name
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_acm_certificate" "site" {
  domain_name               = local.primary_domain
  subject_alternative_names = slice(var.domain_names, 1, length(var.domain_names))
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "site" {
  certificate_arn = aws_acm_certificate.site.arn

  validation_record_fqdns = [
    for validation_record in aws_acm_certificate.site.domain_validation_options :
    validation_record.resource_record_name
  ]
}

resource "aws_security_group" "alb" {
  name        = "${local.resource_name_prefix}-alb-sg"
  description = "Allow web traffic to ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "web" {
  name        = "${local.resource_name_prefix}-web-sg"
  description = "Allow ALB traffic to web instances"
  vpc_id      = var.vpc_id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "web_instance" {
  name               = "${local.resource_name_prefix}-web-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

data "aws_iam_policy_document" "web_instance_s3_access" {
  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
  }
}

resource "aws_iam_role_policy" "web_instance_s3_access" {
  name   = "${local.resource_name_prefix}-web-s3-access"
  role   = aws_iam_role.web_instance.id
  policy = data.aws_iam_policy_document.web_instance_s3_access.json
}

resource "aws_iam_instance_profile" "web_instance" {
  name = "${local.resource_name_prefix}-web-profile"
  role = aws_iam_role.web_instance.name
}

resource "aws_launch_template" "web" {
  name_prefix   = "${local.resource_name_prefix}-web-"
  image_id      = var.web_ami_id
  instance_type = var.web_instance_type

  vpc_security_group_ids = [aws_security_group.web.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.web_instance.name
  }

  user_data = base64encode(templatefile("${path.module}/templates/user_data.sh.tftpl", {
    site_bucket_name = aws_s3_bucket.site.bucket
  }))
}

resource "aws_lb" "site" {
  name               = "${local.resource_name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "web" {
  name        = "${local.resource_name_prefix}-web-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = "/"
    matcher             = "200-399"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }
}

resource "aws_autoscaling_group" "web" {
  name                = "${local.resource_name_prefix}-web-asg"
  desired_capacity    = var.web_desired_capacity
  min_size            = var.web_min_size
  max_size            = var.web_max_size
  vpc_zone_identifier = var.public_subnet_ids
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.site.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.site.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.site.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }

  depends_on = [aws_acm_certificate_validation.site]
}

resource "aws_globalaccelerator_accelerator" "site" {
  name            = "${local.resource_name_prefix}-accelerator"
  enabled         = true
  ip_address_type = "IPV4"
}

resource "aws_globalaccelerator_listener" "site" {
  accelerator_arn = aws_globalaccelerator_accelerator.site.id
  protocol        = "TCP"

  port_range {
    from_port = 80
    to_port   = 80
  }

  port_range {
    from_port = 443
    to_port   = 443
  }
}

resource "aws_globalaccelerator_endpoint_group" "site" {
  listener_arn = aws_globalaccelerator_listener.site.id

  endpoint_configuration {
    endpoint_id = aws_lb.site.arn
    weight      = 128
  }
}

resource "aws_route53_zone" "public_managed" {
  count = var.manage_route53_records && var.route53_zone_id == "" && var.create_route53_zone ? 1 : 0

  name = local.route53_zone_dns_name
}

data "aws_route53_zone" "public_lookup" {
  count = var.manage_route53_records && var.route53_zone_id == "" && !var.create_route53_zone ? 1 : 0

  name         = "${local.route53_zone_dns_name}."
  private_zone = false
}

resource "aws_route53_record" "frontend_a" {
  for_each = var.manage_route53_records ? toset(var.domain_names) : toset([])

  zone_id = local.route53_resolved_zone_id
  name    = each.value
  type    = "A"
  ttl     = 300
  records = local.global_accelerator_ip_addresses
}
