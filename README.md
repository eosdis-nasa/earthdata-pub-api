# Earthdata Pub API

This is the api code repository for Earthdata Pub.

## Table of Contents

- [Contributing](#contributing)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Packaging](#packaging)
- [Deploying](#deploying)
- [Running Tests](#running-tests)

## Contributing

The [`CONTRIBUTING.md`](./CONTRIBUTING.md) has instruction for contributing to the Earthdata Pub project. Be sure to read that before submitting pull requests.

## Getting Started

### Prerequisites
The following are required for following the packaging and deploying steps:
* [Amazon AWS](https://aws.amazon.com/) An AWS account is required. Another possible option is [LocalStack](https://github.com/localstack/localstack) though this project has not been tested with it.
* [Terraform](https://github.com/hashicorp/terraform) AWS components are provisioned using Terraform.
* [Node.js](https://nodejs.org/en/download/) AWS Lambda functions and layers are implemented in Node.js 12.16.2. The Node Package Manager is also required but included with a standard Node.js installation.

### Installing
The first step is to clone the repo!
```
$ git clone https://git.earthdata.nasa.gov/scm/edpub/api.git
```

### Packaging
Next, run the build script to install dependencies and package components for deployment.

```
$ ./build.sh
```

### Deploying
#### State Management
Before deploying for the first time you will need to configure your state management for either remote or local.
##### Remote State
You can create the bucket with the following:
```
aws s3 mb s3://earthdatapub-terraform-state --region <aws_region>
```
Where `<aws_region>` will be replaced with the AWS region you are deploying to. e.g. us-east-1 us-west-2

Next, copy the template state file into the bucket.
```
aws s3 cp initial.tfstate s3://earthdatapub-terraform-state/<stage>/terraform.tfstate
```
Where `<stage>` is the environment you are deploying to. e.g. dev test ops

##### Local State
To use local state management delete or comment out the following configuration block in `main.tf`:
```
data "terraform_remote_state" "earthdatapub_state" {
  backend = "s3"
  config = {
    bucket = "earthdatapub-terraform-state"
    key    = "${var.stage}/terraform.tfstate"
    region = var.region
  }
}
```

#### Terraform Variables
Before deploying you must make changes to `terraform.tfvars` for your custom deployment:
```
profile = "<aws_profile>"
region = "<aws_region>"
stage = "<dev, test, prod>"
api_gateway_policy = "<json_policy_file_name>" #This file should be in ./iam
ngap = <true|false> # If this deployment requires NGAP configurations
ngap_lambda_policy = "<name_of_iam_policy>" # Typically ngap/system/NGAPShLambdaInVpcBasePolicy
ngap_role_boundary = "<name_of_permissions_boundry>" # Typically NGAPShRoleBoundary
vpc_enabled = "<true|false>" # If Lambdas will be attached to a VPC
subnet_ids = ["<subnet-xxx>"] # Subnet Ids of VPC Lambdas will attach to
security_group_ids = ["<sg-xxx>"] # Security Group Ids of VPC Lambdas will attach to
```

#### Terraform Deploy
From here you are ready to deploy using Terraform.

##### Initialize
Run the following to install Terraform modules.
```
$ terraform init
```
##### Validate
Next, it is recommended to validate.
```
$ terraform validate
```
#### Plan
Then generate a plan.
```
$ terraform plan -out=tfplan
```
#### Apply
Finally, apply the plan!
```
$ terraform apply tfplan
```


## Running Tests

Earthdata Pub uses [Jest](https://jestjs.io/) for unit testing and [ESLint](https://github.com/eslint/eslint) for linting. It adheres to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with a few minor exceptions. The configuration can be viewed in `lambda/modules/eslint.config.json`.

To run the tests change to the directory of the parent Node.js module.
```
$ cd lambda/modules
```
Install dependencies. This may take a minute.
```
$ npm install
```
And run the tests.
```
$ npm test
```

The `test` command will run the linter and the unit tests generating the following reports:

`eslint.json`
`jest.json`

They are formatted to be compatible with the Mocha Test Parser in [Atlassian Bamboo](https://www.atlassian.com/software/bamboo) for inclusion in a CI pipeline.
