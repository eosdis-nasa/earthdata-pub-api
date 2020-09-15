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
* [Amazon AWS](https://aws.amazon.com/) An AWS account is required for live deployment.
* [LocalStack](https://github.com/localstack/localstack) Optionally, LocalStack can be used for running a local instance.
* [Terraform](https://github.com/hashicorp/terraform) AWS components are provisioned using Terraform.
* [Node.js](https://nodejs.org/en/download/) AWS Lambda functions and layers are implemented in Node.js 12.16.2. The Node Package Manager is also required but included with a standard Node.js installation.

### Installing
The first step is to clone the repo!
```
$ git clone https://git.earthdata.nasa.gov/scm/edpub/api.git
```
Then install using npm
```
$ npm install
```

### Build and Package
Next, run the build script to install dependencies and package the submodules for deployment. This step also sets up some of the Terraform modules according to the environment you specify. New deployment profiles can be added in `/terraform/profiles`

#### Build for LocalStack
```
$ npm run build:localstack
```
#### Build for an AWS environment
```
$ npm run build:sandbox
```


### Deploying
#### State Management
##### Remote State
Remote State is used by the existing AWS profiles, but developers can use local state with a custom profile.
You can create the bucket with the following:
```
aws s3 mb earthdatapub-terraform-state --region <aws_region>
```
Where `<aws_region>` will be replaced with the AWS region you are deploying to. e.g. us-east-1 us-west-2

Next, copy the template state file into the bucket.
```
aws s3 cp ./terraform/initial.tfstate s3://earthdatapub-terraform-state/<stage>/terraform.tfstate
```
Where `<stage>` is the environment you are deploying to. e.g. dev test ops

#### Local State
The LocalStack profile uses local state management. LocalStack doesn't persist resources across restarts by default, so if you restart your LocalStack instance after deploying you will need to remove your ```terraform.tfstate``` and ```terraform.tfstate.backup``` files to start fresh.

#### Terraform Deploy
From here you are ready to deploy using Terraform. First change to the ```terraform``` directory.
```
$ cd terraform
```

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

## Testing and Linting

[Jest](https://jestjs.io/) is used for unit testing Lambda functions and Lambda layers. Jest configuration is located in `jest.config.js`.

```
$ npm run test
```

[ESLint](https://github.com/eslint/eslint) is used for linting. It adheres to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with a few minor exceptions. The configuration can be viewed in `eslint.config.json`.

```
$ npm run lint
```

Output from these commands in formatted for Bamboo](https://www.atlassian.com/software/bamboo) for use in the CICD pipeline.

## Documentation

Earthdata Pub leverages SwaggerUI and JSDoc for developer documentation. Static site documentation for each is generated during the build step and placed in the docs folder and as a zipped file in the artifacts folder.

Optionally you can generate documentation without building.
```
$ npm run generate-docs
```
