const { Client } = require('pg');

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

function addLimit(query) {
  return `${query} LIMIT {{limit}} OFFSET {{offset}}`;
}

function addSort(query, sort, order = 'ASC') {
  const [sanSort] = sort.split(' ');
  const [sanOrder] = order.split(' ');
  return `${query} ORDER BY ${sanSort} ${sanOrder}`;
}

async function execute({ resource, operation }, params) {
  const client = new Client(config);
  const response = {};
  try {
    client.connect();
    let query = statements[resource][operation];
    if (params.sort) {
      query = addSort(query, params.sort, params.order);
    }
    if (params.limit) {
      query = addLimit(query);
    }
    const { text, values } = getValueList(query, params);
    const { rows } = await client.query({ text, values, rowMode: 'object' });
    Object.assign(response, { data: parse[operation](rows) });
  } catch (e) {
    Object.assign(response, { error: e });
  } finally {
    client.end();
  }
  return response.data || response.error;
}

async function seed() {
  const client = new Client(config);
  const response = {};
  try {
    client.connect();
    await client.query(fs.readFileSync('./1-init.sql'));
    await client.query(fs.readFileSync('./2-tables.sql'));
    await client.query(fs.readFileSync('./3-functions.sql'));
    await client.query(fs.readFileSync('./4-triggers.sql'));
    await client.query(fs.readFileSync('./5-seed.sql'));
    Object.assign(response, { data: 'Successfully seeded!' });
  } catch (e) {
    Object.assign(response, { error: e });
  } finally {
    client.end();
  }
  return response.data || response.error;
}

module.exports.execute = execute;
