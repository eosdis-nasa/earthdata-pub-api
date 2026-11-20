/**
 * Lambda to expose version of the API
 * @module Version
 */

const version = {
  response_version: 'v1',
  api_version: process.env.API_VERSION
};
const { guard } = require('./error-reference');

async function handler() {
  return version;
}

module.exports.handler = guard(handler);
