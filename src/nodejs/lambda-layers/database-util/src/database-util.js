const fs = require('fs');

const { Pool } = require('pg');

const statements = require('./query/statements.js');

const parse = require('./query/parse.js');

const { getValueList } = require('./utils.js');

const config = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT
};

const pool = new Pool(config);

async function execute({ resource, operation }, params) {
  const response = { data: {} };
  try {
    const query = statements[resource][operation](params);
    const { text, values } = getValueList(query, params);
    const { rows } = await pool.query({ text, values, rowMode: 'object' });
    const data = parse[operation](rows);
    if (data) {
      Object.assign(response, { data });
    } else {
      Object.assign(response, { data: { error: 'No results' } });
    }
  } catch (e) {
    Object.assign(response, { data: { error: e } });
  }
  return response.data;
}

async function seed() {
  const response = {};
  const client = await pool.connect().catch((e) => { Object.assign(response, { error: e }); });
  if (!response.error) {
    try {
      const files = fs.readdirSync(`${__dirname}/db-setup`).map((filename) => `${__dirname}/db-setup/${filename}`);
      await files.reduce(async (previous, file) => {
        await previous;
        console.info(`Executing ${file}:`);
        const results = await client.query(fs.readFileSync(file).toString());
        if (Array.isArray(results)) {
          Object.entries(results.reduce((acc, result) => {
            acc[result.command] = 1 + acc[result.command] || 1;
            return acc;
          }, {})).forEach(([key, value]) => {
            console.info(`${key} ${value}`);
          });
        } else {
          console.info(`${results.command} 1`);
        }
        return results;
      }, 0);
      Object.assign(response, { data: 'Successfully seeded!' });
    } catch (e) {
      Object.assign(response, { error: e });
    } finally {
      client.release();
    }
  }
  return response.data || response.error;
}

module.exports.execute = execute;
module.exports.seed = seed;
