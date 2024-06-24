const db = require('database-util');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const delResponse = await db.submission.stepCleanup();
  console.info(`[EVENT]\n${JSON.stringify(delResponse)}`);
}

exports.handler = handler;
