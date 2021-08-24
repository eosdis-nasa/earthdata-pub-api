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
* [Terraform](https://github.com/hashicorp/terraform) AWS components are provisioned using Terraform v1.0.0.
* [Node.js](https://nodejs.org/en/download/) AWS Lambda functions and layers are implemented in Node.js 12.16.2. The Node Package Manager is also required but included with a standard Node.js installation.
* [Docker](https://www.docker.com/) Docker is used to create the local test environment including the following services Postgresql, PgAdmin, GoAws for mocking SNS and SQS, Node OASTools for serving the API.

### Installing
The first step is to clone the repo!
```
$ git clone https://git.earthdata.nasa.gov/scm/edpub/api.git
```
Then install using npm
```
$ npm install
```

### Build and Run Local
To build and run a local instance execute:
```
$ npm run build:local
```
This will install required dependencies in the submodules, aggregate the schema models and insert them in the OpenAPI spec, and copy the database bootstrapping scripts to the DatabaseUtil module.
To launch your local instance execute:
```
$ npm run start
```
or to run the containers in detached mode:
```
$ npm run start:detached
```
The start script is just a proxy for:
```
$ docker-compose up
```
which will lauch the containers defined in `docker-compose.yml`.
Upon the first startup, the Postgres container will run all of the setup scripts and seed the tables with basic data.
Listed here are some QOL tag-ons to the local instance of the API.
`/auth` This is an authentication endpoint that mimics the behavior of Cognito, but allows you to choose a test user from a dropdown list, and register new test users.
`/reseed` This is an endpoint that triggers a reseed of the database to prevent the need to prune docker volumes to force the Postgres container to rerun the setup.
`/goaws/` The endpoints under here expose the backend SNS consumers and wraps incoming requests to imitate SNS triggered lambda events.
`pgAdmin` This helps with trouble-shooting queries and browsing data in your database. In a browser navigate to http://localhost:8001
  Log in with:
    Email: edpub@edpub.com
    Password: edpub,
  Right click Servers->Create->Server... Use the following values to initiate the connection:
    Name: edpub
    Host: postgres
    Username: edpub
    Password: edpub

#### Build and Deploy to AWS
Execute the following to install dependencies and package all of the deployment modules:
```
$ npm run build
```
Move to the terraform sub directory
```
$ cd terraform
```
Create a `.tfvars` file to set the required variables or set appropriate environment variables in your OS, you can see the list of required values in `variables.tf`. The Terraform configuration doesn't create your backend database, you will need to create a Postgres 10+ compatible RDS instance, this allows for flexibility between test and production environments.

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
$ terraform plan -out=tfplan -var-file=env.tfvars
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
