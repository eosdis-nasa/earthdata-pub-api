variable "stage" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "edpub_event_sns_arn" {
  type = string
}

variable "dlq_message_retention" {
  type = number
  description = "Message retention in seconds for dead letter queues. Default is 14 days"
  default = 1209600
}

variable "visibility_timeout_seconds" {
  type = number
  description = "Seconds after a consumer accepts message before consumer can attempt to receive or process the same message."
  default = 180
}

variable "receive_wait_time_seconds" {
  type = number
  description = "Intentional delay of message to queue in seconds"
  default = 20
}

variable "maxReceiveCount" {
  type = number
  description = "Number of times a sqs consumer will retry ingesting a message before sending the message to the dlq"
  default = 5
}