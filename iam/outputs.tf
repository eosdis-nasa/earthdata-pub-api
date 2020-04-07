output "dynamodb_lambda_role_arn" {
  value = "${aws_iam_role.dynamodb_lambda_role.arn}"
}
