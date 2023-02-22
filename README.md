# Earthdata Pub API

This is the api code repository for Earthdata Pub.

## Table of Contents

- [Contributing](#contributing)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Building and running locally](#building-and-running-locally)
- [Deploying](#deploying)
- [Testing](#testing)
- [Documentation](#documentation)

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for instruction for contributing to
the EDPub project. Be sure to read that before submitting pull requests.

### Prerequisites

The following are required for following the packaging and deploying steps:

- [Amazon AWS](https://aws.amazon.com/) An AWS account is required for live deployment.
- [Terraform](https://github.com/hashicorp/terraform) AWS components are
  provisioned using Terraform v1.0.0.
- [Node.js](https://nodejs.org/en/download/) AWS Lambda functions and layers are
  implemented in Node.js 18.14.1. The Node Package Manager is also required but included
  with a standard Node.js installation.
- [Docker](https://www.docker.com/) Docker is used to create the local test
  environment including the following services Postgresql, PgAdmin, GoAws for
  mocking SNS and SQS, Node OASTools for serving the API.

### Installing

The first step is to clone the repo!

```bash
git clone https://git.earthdata.nasa.gov/scm/edpub/api.git
cd api
npm install
```

### Building and running locally

To build and run a local instance execute:

```bash
npm run build:local
```

This will install required dependencies in the submodules, aggregate the schema models
and insert them in the OpenAPI spec, and copy the database bootstrapping scripts
to the DatabaseUtil module.

To launch your local instance execute:

```bash
npm run start
```

or to run the containers in detached mode:

```bash
npm run start:detached
```

The start script is just a proxy for:

```bash
docker-compose up
```

which will launch the containers defined in `docker-compose.yml`.

Upon the first startup, the Postgres container will run all of the setup scripts
and seed the tables with basic data.
Listed here are some QOL tag-ons to the local instance of the API.

- `/auth` This is an authentication endpoint that mimics the behavior of Cognito,
but allows you to choose a test user from a dropdown list, and register new test
users.
- `/reseed` This is an endpoint that triggers a reseed of the database to prevent
the need to prune docker volumes to force the Postgres container to rerun the setup.
- `/goaws/` The endpoints under here expose the backend SNS consumers and wraps
incoming requests to imitate SNS triggered lambda events.
- `pgAdmin` This helps with trouble-shooting queries and browsing data in your
  database. In a browser navigate to <http://localhost:8001>
  - Log in with:  
    Email: edpub@edpub.com  
    Password: edpub,  
  - Right click Servers->Create->Server... Use the following values to initiate
  the connection:  
    Name: edpub  
    Host: postgres  
    Username: edpub  
    Password: edpub  

## Deploying

Deployment is handled by Bamboo. See Bamboo config for details. The deprecated
[Build and Deploy to AWS](./DEPLOY.md) is available if Bamboo fails.

## Testing

[Jest](https://jestjs.io/) is used for unit testing Lambda functions and Lambda
layers. Jest configuration is located in `jest.config.js`.

```bash
npm run test
```

[ESLint](https://github.com/eslint/eslint) is used for linting. It adheres to the
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with a few
exceptions. The configuration can be viewed in `eslint.config.json`.

```bash
npm run lint
```

Output from these commands in formatted for [Bamboo](https://www.atlassian.com/software/bamboo)
for use in the CI/CD pipeline.

## Documentation

Earthdata Pub leverages SwaggerUI and JSDoc for developer documentation. Static
site documentation for each is generated during the build step and placed in the
docs folder and as a zipped file in the artifacts folder.

Optionally you can generate documentation without building.

```bash
npm run generate-docs
```
