# Lambda IAM Role

resource "aws_iam_role_policy" "edpub_lambda_policy" {
  name   = "EDPUBLambdaPolicy"
  role   = aws_iam_role.edpub_lambda_role.id
  policy = data.template_file.edpub_lambda_policy.rendered
}

resource "aws_iam_role" "edpub_lambda_role" {
  name                 = "EDPUBLambdaRole"
  assume_role_policy   = data.template_file.edpub_lambda_assume_role.rendered
}

resource "aws_iam_role_policy_attachment" "edpub_lambda_execution_role_attach" {
  role       = aws_iam_role.edpub_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

data "aws_iam_policy_document" "ornl_s3_access" {
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${var.ornl_bucket_name}/*"
    ]
  }
}

resource "aws_iam_role_policy" "allow_put_to_ornl" {
  name   = "${var.stage}-edpub-put-to-ornl"
  role   = aws_iam_role.edpub_lambda_role.id
  policy = data.aws_iam_policy_document.ornl_s3_access.json
}

resource "aws_iam_role_policy" "edpub_apigateway_s3_policy" {
  name = "EDPUBApigatewayS3Policy"
  role = aws_iam_role.edpub_apigateway_s3_role.id
  policy = data.template_file.edpub_apigateway_s3_policy.rendered
}

resource "aws_iam_role" "edpub_apigateway_s3_role" {
  name = "EDPUBApigatewayS3Role"
  assume_role_policy = data.template_file.edpub_apigateway_s3_assume_role.rendered
}

resource "aws_iam_role_policy" "edpub_rds_backup_lambda_policy" {
  name   = "EDPUBRDSBackupLambdaPolicy"
  role   = aws_iam_role.edpub_rds_backup_lambda_role.id
  policy = data.template_file.edpub_rds_backup_lambda_policy.rendered
}

resource "aws_iam_role" "edpub_rds_backup_lambda_role" {
  name                 = "EDPUBRDSBackupLambdaRole"
  assume_role_policy   = data.template_file.edpub_lambda_assume_role.rendered
}

resource "aws_iam_role_policy_attachment" "edpub_rds_backup_lambda_execution_role_attach" {
  role       = aws_iam_role.edpub_rds_backup_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}