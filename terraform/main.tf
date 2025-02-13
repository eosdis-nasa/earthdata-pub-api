provider "aws" {
  region  = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

provider "aws" {
  region  = "us-east-1"
  access_key = var.access_key
  secret_key = var.secret_key
  alias   = "east-1-provider"
}
