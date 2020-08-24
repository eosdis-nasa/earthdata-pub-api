resource "aws_sqs_queue" "edpub_queue" {
  name                        = "edpub_queue${var.stage_suffix}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}
