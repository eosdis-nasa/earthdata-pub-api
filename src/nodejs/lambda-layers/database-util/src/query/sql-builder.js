const opTypes = {
  'eq': '=',
  'ne': '<>',
  'gt': '>',
  'gte': '>=',
  'lt': '<',
  'lte': '<=',
  'lk': 'LIKE',
  'or': 'OR',
  '||': 'OR',
  'and': 'AND',
  '&&': 'AND',
  'not': 'NOT',
  '!': 'NOT'
}

const complexParse = (src) => complexTypes[src.type](src);

const select = ({ fields, from, where, group, order, sort, limit, offset, alias }) =>
  `${alias ? `(`: ``}SELECT${fields ?
  ` ${fields.map(fieldParse)}` : ` *`}${from ?
  ` FROM ${fromClause(from)}` : ``}${where ?
  ` WHERE ${whereClause(where)}` : ``}${group ?
  ` GROUP BY ${group}` : ``}${order ?
  ` ORDER BY ${order}${sort ? ` ${sort}` : ``}` : ``}${limit ?
  ` LIMIT ${limit}` : ``}${offset ?
  ` OFFSET ${offset}` : ``}${alias ? `) ${alias}`: ``}`;

const fieldParse = (field) =>
  ` ${field.type ? complexParse(field) : field}`;

function fromClause({ base, joins }) {
  return ` ${base}${joins ? joins.map(complexParse).join(` `) : ``}`;
}

function whereClause({ filters }) {
  return `${filters.map(filter)}`
}

const caseClause = ({ when, alias }) =>
  `${alias ? `(` : ``}CASE ${when.map(whenClause).join(``)} END${alias ?
  `) ${alias}` : ``}`;

const whenClause = ({ field, value, result }) =>
  ` WHEN ${field} = '${value}' THEN '${result}'`

const leftJoin = ({ src, on }) =>
  ` LEFT JOIN ${src.type ? complexParse(src) : src}${on ?
  ` ON ${on.left} = ${on.right}` : ``}`;

const naturalJoin = ({ src }) =>
  ` NATURAL JOIN ${src.type ? complexParse(src) : src}`;

const naturalLeftJoin = ({ src, on }) =>
  ` NATURAL LEFT JOIN ${src.type ? complexParse(src) : src}`;

function filter({ logOp, field, op, value }) {
  return `${logOp ? ` ${opTypes[logOp]}` : ``} ${field} ${opTypes[op] || `=`} ${value || `{{${field}}}`}`;
}

function sub({ query, alias }) {
  return `(${query})${alias ? ` ${alias}` : ``}`;
}

const coalesce = ({ src, fallback, alias }) =>
  ` COALESCE(${src.type ? complexParse(src) : src}, ${fallback})${alias ?
    ` ${alias}` : ``}`;

function jsonAgg({ src, order, sort, alias }) {
  return `JSONB_AGG(${src.type ? complexParse(src) : src}${order ?
  ` ORDER BY ${order}${sort ? ` ${sort}` : ``}` : ``})${alias ?
    ` ${alias}` : ``}`;
}

function jsonMergeAgg({ src, order, sort, alias }) {
  return `JSONB_MERGE_AGG(${src.type ? complexParse(src) : src}${order ?
  ` ORDER BY ${order}${sort ? ` ${sort}` : ``}` : ``})${alias ?
    ` ${alias}` : ``}`;
}

function jsonObj({ keys, alias, strip }) {
  return `${strip ? `JSONB_STRIP_NULLS(` : ``}JSONB_BUILD_OBJECT(${keys.map(([key, src]) =>
    `'${key}', ${src.type ? complexParse(src) : src}`)})${strip ? `)` : ``}${alias ?
    ` ${alias}` : ``}`;
}

const getValueList = (query, params) => {
  let count = 0;
  const values = [];
  const text = query.replace(/\{\{(.*?)\}\}/g, (match, token) => {
    values.push(params[token]);
    count += 1;
    return `$${count}`;
  });
  return { text, values };
}

const complexTypes = {
  select: select,
  left_join: leftJoin,
  natural_join: naturalJoin,
  natural_left_join: naturalLeftJoin,
  case: caseClause,
  coalesce: coalesce,
  json_agg: jsonAgg,
  json_merge_agg: jsonMergeAgg,
  json_obj: jsonObj
};



// function filterFields(filters) {
//   return [
//     `WHERE`,
//     filters.map(filter => attribute(filter)).join(` AND `)
//   ].join(` `);
// }
// function where(filters) {
//   return `WHERE ${filters.join(` AND `)}`;
// }
//
// function attribute(attribute) {
//   return `${attribute.field} ${attribute.op ? attribute.op : `=`} ${attribute.value}`;
// }
//
//
// function naturalJoin(table) {
//   return `NATURAL JOIN ${table}`;
// }
//
// function leftJoin(body) {
//   return `LEFT JOIN ${body}`
// }
//
// function on(first, second) {
//   return `ON (${fist} = $second)`;
// }
//
// function sub(query) {
//   return `(${query})`;
// }
//
// function with(subs) {
//   return `WITH ${subs.map([alias, query] => `${alias} AS ${query}`).join[' ,']}`;
// }
//
// function insert(table, fields) {
//   return `INSERT INTO ${table}${fields ? `(${fields.join[`,`]})` : ``}`;
// }
//
// function values(vals) {
//   return `VALUES (${vals.join(`,`)})`;
// }
//
// function update(table) {
//   return `UPDATE ${table}`;
// }
//
// function set(mapping) {
//   return `SET ${mapping.map(attribute).join(`,`)}`
// }
//
// function returning(value) {
//   return `RETURNING ${value}`;
// }
//
//
// function order(field, sort = 'ASC') {
//   return `ORDER BY ${field} ${sort}`;
// }

module.exports = { select, complexParse, fromClause, whereClause, filter, sub, coalesce, jsonAgg, jsonObj, getValueList }
