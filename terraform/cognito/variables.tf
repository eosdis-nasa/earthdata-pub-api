variable "stage" {
  type = string
}

variable "region" {
  type = string
}

variable "auth_callback_urls" {
  type = list(string)
}

variable "auth_logout_urls" {
  type = list(string)
}
