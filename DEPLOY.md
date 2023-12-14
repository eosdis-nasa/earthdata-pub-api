# Build and Deploy to AWS

DEPRECATED: The following is now performed by Bamboo.

Execute the following to install dependencies and package all of the deployment modules:

```
npm run build
```

Move to the terraform sub directory

```
cd terraform
```

Create a `.tfvars` file to set the required variables or set appropriate environment
variables in your OS, you can see the list of required values in `variables.tf`.
The Terraform configuration doesn't create your backend database, you will need
to create a Postgres 10+ compatible RDS instance, this allows for flexibility
between test and production environments.

## Initialize

Run the following to install Terraform modules.

```
terraform init
```

## Validate

Next, it is recommended to validate.

```
terraform validate
```

### Plan

Then generate a plan.

```
terraform plan -out=tfplan -var-file=env.tfvars
```

### Apply

Finally, apply the plan!

```
terraform apply tfplan
```
