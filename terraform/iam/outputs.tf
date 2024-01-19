output "edpub_lambda_role_arn" {
  value = aws_iam_role.edpub_lambda_role.arn
}

output "edpub_apigateway_s3_role_arn" {
  value = aws_iam_role.edpub_apigateway_s3_role.arn
}

output "edpub_rds_backup_lambda_role_arn" {
  value = aws_iam_role.edpub_rds_backup_lambda_role.arn
}