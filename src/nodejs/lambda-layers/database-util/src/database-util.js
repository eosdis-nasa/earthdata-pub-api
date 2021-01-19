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

function addLimit(query) {
  return `${query} LIMIT {{limit}} OFFSET {{offset}}`;
}

function addSort(query, sort, order = 'ASC') {
  const [sanSort] = sort.split(' ');
  const [sanOrder] = order.split(' ');
  return `${query} ORDER BY ${sanSort} ${sanOrder}`;
}

async function execute({ resource, operation }, params) {
  const response = {};
  try {
    let query = statements[resource][operation];
    if (params.sort) {
      query = addSort(query, params.sort, params.order);
    }
    if (params.limit) {
      query = addLimit(query);
    }
    const { text, values } = getValueList(query, params);
    const { rows } = await pool.query({ text, values, rowMode: 'object' });
    Object.assign(response, { data: parse[operation](rows) });
  } catch (e) {
    Object.assign(response, { error: e });
  }
  return response.data || response.error;
}

async function seed() {
  const response = {};
  const client = await pool.connect().catch( e => { Object.assign(response, { error: e })});
  if (!response.error) {
    try {
      console.info(await client.query(fs.readFileSync(`${__dirname}/1-init.sql`).toString()));
      console.info(await client.query(fs.readFileSync(`${__dirname}/2-tables.sql`).toString()));
      console.info(await client.query(fs.readFileSync(`${__dirname}/3-functions.sql`).toString()));
      console.info(await client.query(fs.readFileSync(`${__dirname}/4-triggers.sql`).toString()));
      console.info(await client.query(fs.readFileSync(`${__dirname}/5-seed.sql`).toString()));
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
