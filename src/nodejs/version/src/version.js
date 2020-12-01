/**
 * Lambda to expose version of the API
 * @module Version
 */

const version = {
  response_version: 'v1',
  api_version: process.env.API_VERSION
}

async function handler(event) {
  return version;
}

module.exports.handler = handler;
