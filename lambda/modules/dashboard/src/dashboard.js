/**
 * Lambda that exposes Dashboard API to AWS API Gateway. This lambda
 * is used for populating Dashboard pages on the client.
 * @module Dashboard
 */

async function handler(event) {
  return {
    statusCode: 200,
    body: JSON.stringify(event)
  };
}

exports.handler = handler;
