output "get_item_lambda_arn" {
  value = aws_lambda_function.get_item.invoke_arn
}

output "put_item_lambda_arn" {
  value = aws_lambda_function.put_item.invoke_arn
}
