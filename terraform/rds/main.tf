data "aws_rds_cluster" "edpub_rds" {
  cluster_identifier = var.rds_cluster_identifier
}
