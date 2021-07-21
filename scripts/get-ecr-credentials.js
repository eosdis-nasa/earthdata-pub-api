const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const access = process.env.AWS_ACCESS_KEY_ID;
const secret = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_DEFAULT_REGION;
const date = new Date().toISOString().replace(/-|:/g, '').slice(0, 15) + 'Z';
const service = 'ecr';
const payload = {};
const stringPayload = JSON.stringify(payload);
const hashedPayload = hash(stringPayload, null, 'hex');

function hash(message, key, encoding) {
  const hmac = key ?
    crypto.createHmac('sha256', key) : crypto.createHash('sha256');
  hmac.update(message || '');
  return encoding ? hmac.digest(encoding) : hmac.digest();
}

function getSignatureKey() {
  const dateKey = hash(date.slice(0, 8), `AWS4${secret}`);
  const regionKey = hash(region, dateKey);
  const serviceKey = hash(service, regionKey);
  return hash('aws4_request', serviceKey);
}

function canonicalRequest(payload) {
  const canonical = [];
  canonical.push(`POST`);
  canonical.push(`/`);
  canonical.push(``);
  canonical.push(`content-type:application/x-amz-json-1.1`)
  canonical.push(`host:${service}.${region}.amazonaws.com`);
  canonical.push(`x-amz-content-sha256:${hashedPayload}`);
  canonical.push(`x-amz-date:${date}`);
  canonical.push(`x-amz-target:AmazonEC2ContainerRegistry_V20150921.GetAuthorizationToken`);
  canonical.push(``);
  canonical.push(`content-type;host;x-amz-content-sha256;x-amz-date;x-amz-target`);
  canonical.push(hashedPayload);
  return hash(canonical.join('\n'), null, 'hex');
}

function getStringToSign() {
  const signable = [];
  signable.push(`AWS4-HMAC-SHA256`);
  signable.push(date);
  signable.push(`${date.slice(0, 8)}/${region}/${service}/aws4_request`);
  signable.push(canonicalRequest());
  return signable.join('\n');
}

function getCredential() {
  return `${access}/${date.slice(0, 8)}/${region}/${service}/aws4_request`;
}

function getSignature() {
  const signature = getSignatureKey();
  const signable = getStringToSign();
  return hash(signable, signature, 'hex');
}

function getAuthorization() {
  const auth = [];
  auth.push(`AWS4-HMAC-SHA256 Credential=${getCredential()}`);
  auth.push(`SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date;x-amz-target`);
  auth.push(`Signature=${getSignature()}`)
  return auth.join(', ');
}

const options = {
  hostname: `${service}.${region}.amazonaws.com`,
  path: '/',
  method: 'POST',
  headers: {
    'X-Amz-Content-Sha256': hashedPayload,
    'X-Amz-Date': date,
    'X-Amz-Target': 'AmazonEC2ContainerRegistry_V20150921.GetAuthorizationToken',
    'Content-Type': 'application/x-amz-json-1.1',
    'Content-Length': stringPayload.length,
    'Authorization': getAuthorization()
  }
}
const req = https.request(options, (res) => {
  res.on('data', (d) => {
    const encoded = JSON.parse(d).authorizationData[0].authorizationToken;
    const buffer = Buffer.from(encoded, 'base64');
    const token = buffer.toString().split(':')[1];
    const dataout = `ecr_password=${token}`;
    fs.writeFileSync('ecr-credentials', dataout)
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(stringPayload);
req.end();
