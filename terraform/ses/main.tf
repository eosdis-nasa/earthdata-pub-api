resource "aws_sesv2_configuration_set" "edpub_configuration_set" {
  
  provider = aws.east-1-provider

  configuration_set_name = var.ses_configuration_set_name

  delivery_options {
    tls_policy = "REQUIRE"
  }

  reputation_options {
    reputation_metrics_enabled = true
  }

  sending_options {
    sending_enabled = true
  }

  tags = []
}
