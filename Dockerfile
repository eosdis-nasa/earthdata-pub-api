# This is the Dockerfile used to created the EDPub base docker image
# for bamboo deployments. First build this locally, push to the sit
# ecr, then run the EDPUB DockerPush bamboo plan.

FROM amazon/aws-cli:latest as aws

FROM node:18.14.1

RUN \
apt-get update -y && \
apt-get install zip -y

RUN \
wget --quiet https://releases.hashicorp.com/terraform/1.0.0/terraform_1.0.0_linux_amd64.zip && \
unzip terraform_1.0.0_linux_amd64.zip && \
mv terraform /usr/local/bin && \
rm terraform_1.0.0_linux_amd64.zip

RUN \
npm install -g snyk

COPY --from=aws /usr/local/aws-cli/ /usr/local/aws-cli/
COPY --from=aws /usr/local/bin/ /usr/local/bin/
