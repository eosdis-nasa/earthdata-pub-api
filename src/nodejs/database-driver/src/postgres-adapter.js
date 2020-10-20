const { Client } = require('pg');
const statements = require('./query/statements.js');
const parse = require('./query/parse.js');
const { getValueList } = require('./utils.js');

const config = {
  user: 'edpub',
  host: 'postgres',
  database: 'edpub',
  password: 'edpub',
  port: 5432
}

async function execute({ resource, operation }, params) {
  const client = new Client(config);
  let response;
  try {
    client.connect();
    let query = statements[resource][operation];
    if (params.sort) {
      query = sort(query, params.sort, params.order);
    }
    if (params.limit) {
      query = limit(query);
    }
    const { text, values } = getValueList(query, params);
    console.log(text, values);
    const { rows } = await client.query({ text, values, rowMode:'object' });
    response = parse[operation](rows);
  }
  catch(e) {
    console.log(e);
    response = e;
  }
  finally {
    client.end();
  }
  return response;
}

function limit(query) {
  return `${query} LIMIT {{limit}} OFFSET {{offset}}`;
}

function sort(query, sort, order = "ASC") {
  const [sanSort] = sort.split(' ');
  const [sanOrder] = order.split(' ');
  return `${query} ORDER BY ${sanSort} ${sanOrder}`;
}

module.exports.execute = execute;
