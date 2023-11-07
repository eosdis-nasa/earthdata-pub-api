const sql = require('./utils.js');

const table = 'template';
const allFields = ['id'];
const fieldMap = {
  id: 'template.id'
};
const refs = {};

function fields(list) {
  return list.map((field) => fieldMap[field]);
}

function find(params) {
  return sql.select({
    field: fields(allFields),
    from: table
  });
}

module.exports = {
  find,
  tableJoin
};
