const queries = require('./queries.js');
const parsers = require('./parsers.js');

const rowMode = 'object';

const parameterize = (query, params) => {
  const values = [];
  const text = query.replace(/\{\{(.*?)\}\}/g, (match, token) => {
    const value = token.split('.')
      .reduce((obj, key) => key === '$' ? obj : obj[key] || null, params)
    values.push(value);
    return `$${values.length}`;
  });
  return { text, values };
};

const getParameterizedQuery = (resource, operation, params) => {
  const queryGen = queries[resource][operation];
  const query = queryGen(params);
  const parser = parsers[operation];
  return { rowMode, parser, ...parameterize(query, params) };
}

module.exports = Object.entries(queries).reduce((exportable, [resource, operations]) => {
  exportable[resource] = Object.keys(operations).reduce((ops, operation) => {
    ops[operation] = (params) => getParameterizedQuery(resource, operation, params);
    return ops;
  }, {});
  return exportable;
}, {});
