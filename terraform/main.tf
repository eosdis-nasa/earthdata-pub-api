terraform {
  backend "s3" {
    bucket = "edpub-sit-tfstate"
    key    = "terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region  = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}
