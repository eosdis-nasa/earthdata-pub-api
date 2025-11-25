const fs = require('fs');

const { Pool } = require('pg');

const queryBuilder = require('./query/index.js');

const config = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
  ...(process.env.AWS_EXECUTION_ENV && { ssl : { rejectUnauthorized: false }})
};

const pool = new Pool(config);

async function execute({ resource, operation }, params) {
  const response = { data: {} };
  try {
    const { parser, ...query } = queryBuilder[resource][operation](params);
    if (process.env.DEBUG === 'true') {
      // eslint-disable-next-line
      console.debug('DB QUERY: ', query);
    }
    const data = parser(await pool.query(query));
    if (process.env.DEBUG === 'true') {
      // eslint-disable-next-line
      console.debug('DB RESPONSE: ', data);
    }
    if (data) {
      Object.assign(response, { data });
    } else {
      Object.assign(response, { data: { error: 'No results' } });
    }
  } catch (e) {
    Object.assign(response, {
      data: {
        statusCode: 503,
        body: 'Internal Database Error'
      }
    });
    console.error({ error: e });
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

module.exports = Object.entries(queryBuilder).reduce((exportable, [resource, operations]) => {
  exportable[resource] = Object.keys(operations).reduce((ops, operation) => {
    ops[operation] = (params = {}) => execute({ resource, operation }, params);
    return ops;
  }, {});
  return exportable;
}, {});

module.exports.execute = execute;
module.exports.seed = seed;
