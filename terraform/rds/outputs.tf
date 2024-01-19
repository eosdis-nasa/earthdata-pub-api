output "db_user" {
  value = data.aws_rds_cluster.edpub_rds.master_username
}

output "db_host" {
  value = data.aws_rds_cluster.edpub_rds.endpoint
}

output "db_database" {
  value = data.aws_rds_cluster.edpub_rds.database_name
}

output "db_port" {
  value = data.aws_rds_cluster.edpub_rds.port
}
