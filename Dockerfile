FROM node:12.16.1

RUN \
apt-get update -y && \
apt-get install zip -y

RUN \
wget --quiet https://releases.hashicorp.com/terraform/0.12.24/terraform_0.12.24_linux_amd64.zip && \
unzip terraform_0.12.24_linux_amd64.zip && \
mv terraform /usr/local/bin && \
rm terraform_0.12.24_linux_amd64.zip

RUN \
npm install -g jsdoc && \
npm install -g google-closure-compiler
