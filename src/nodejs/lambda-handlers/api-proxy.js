/**
 * Lambda that proxies to the private API to allow serving locally
 * via the local proxy server.
 * @module APIProxy
 */

const https = require('https');

const apiId = process.env.API_ID;
const region = process.env.REGION;
const stage = process.env.STAGE;

const hostname = `${apiId}.execute-api.${region}.amazonaws.com`;

function send({
  method, headers, url, payload
}) {
  console.info(method, headers, url, payload);
  const reqOptions = {
    hostname,
    path: `/${stage}${url}`,
    method,
    headers
  };
  const promise = new Promise((resolve) => {
    const req = https.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: chunks.join('')
        });
      });
    });
    req.on('error', (error) => {
      resolve(error);
    });
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
  return promise;
}

async function handler(event) {
  console.info(event);
  const response = await send(event);
  return response;
}

exports.handler = handler;
