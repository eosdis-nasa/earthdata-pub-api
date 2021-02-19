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

const typeCheck = (stub) =>
  `${stub.type ? complexParse(stub) : stub.param ? param(stub) : stub}`;

const select = ({ fields, from, where, group, order, sort, limit, offset, alias }) =>
  `${alias ? `(`: ``}SELECT${fields ?
  ` ${fields.map(typeCheck)}` : ` *`}${from ?
  fromClause(from) : ``}${where ?
  whereClause(where) : ``}${group ?
  ` GROUP BY ${group}` : ``}${order ?
  ` ORDER BY ${order}${sort ? ` ${sort}` : ``}` : ``}${limit ?
  ` LIMIT ${limit}` : ``}${offset ?
  ` OFFSET ${offset}` : ``}${alias ? `) ${alias}`: ``}`;

const insert = ({ table, values, conflict, returning }) =>
  `INSERT INTO ${typeCheck(table)} ${typeCheck(values)}${conflict ?
  onConflict(conflict) : ``}${returning ?
  returningClause(returning) : ``}`;

const update = ({ table, set, where, returning }) =>
  `UPDATE ${table ? `${table} ` : ``}SET ${set.map(filter).join(`,`)}${where ?
  whereClause(where) : ``}${returning ?
  returningClause : ``}`;

const onConflict = ({ constraints, update }) =>
  ` ON CONFLICT ${constraints ? `(${constraints.join(`,`)}) ` : ``} DO ${update ?
  typeCheck(update) : 'NOTHING'}`;

const returningClause = (field) =>
  ` RETURNING ${field.join(`,`)}`;

const shortTable = ({ base, field }) =>
  `${base}(${field.join(`,`)})`;

const insertValues = ({ values }) =>
  ` VALUES(${values.map(typeCheck).join(`,`)})`

const param = ({param}) =>
  `{{${param}}}`;

const fromClause = ({ base, joins }) =>
  ` FROM ${base}${joins ? joins.map(complexParse).join(` `) : ``}`;

const whereClause = ({ filters }) =>
  ` WHERE ${filters.map(filter).join(` AND `)}`;

const caseClause = ({ when, alias }) =>
  `${alias ? `(` : ``}CASE ${when.map(whenClause).join(``)} END${alias ?
  `) ${alias}` : ``}`;

const whenClause = ({ field, value, result }) =>
  ` WHEN ${field} = '${value}' THEN '${result}'`

const anyClause = ({ values }) =>
  ` ANY(${typeCheck(values)})`;

const leftJoin = ({ src, on }) =>
  ` LEFT JOIN ${src.type ? complexParse(src) : src}${on ?
  ` ON ${on.left} = ${on.right}` : ``}`;

const naturalJoin = ({ src }) =>
  ` NATURAL JOIN ${src.type ? complexParse(src) : src}`;

const naturalLeftJoin = ({ src, on }) =>
  ` NATURAL LEFT JOIN ${src.type ? complexParse(src) : src}`;

const filter = ({ logOp, field, op, value, param, any }) =>
  `${logOp ? ` ${opTypes[logOp]}` : ``} ${field} ${opTypes[op] || `=`} ${value ?
  typeCheck(value) : any ? anyClause(any) : ` {{${param ? param : field}}}`}`;

const sub = ({ query, alias }) =>
  `(${query})${alias ? ` ${alias}` : ``}`;

const coalesce = ({ src, fallback, alias }) =>
  ` COALESCE(${src.type ? complexParse(src) : src}, ${fallback})${alias ?
    ` ${alias}` : ``}`;

const jsonAgg = ({ src, order, sort, alias }) =>
  `JSONB_AGG(${src.type ? complexParse(src) : src}${order ?
  ` ORDER BY ${order}${sort ? ` ${sort}` : ``}` : ``})${alias ?
  ` ${alias}` : ``}`;

const jsonMergeAgg = ({ src, order, sort, alias }) =>
  `JSONB_MERGE_AGG(${src.type ? complexParse(src) : src}${order ?
  ` ORDER BY ${order}${sort ? ` ${sort}` : ``}` : ``})${alias ?
  ` ${alias}` : ``}`;

const jsonObj = ({ keys, alias, strip }) =>
  `${strip ? `JSONB_STRIP_NULLS(` : ``}JSONB_BUILD_OBJECT(${keys.map(([key, src]) =>
  `'${key}', ${src.type ? complexParse(src) : src}`)})${strip ? `)` : ``}${alias ?
  ` ${alias}` : ``}`;

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
  insert: insert,
  update: update,
  insert_values: insertValues,
  short_table: shortTable,
  param: param,
  left_join: leftJoin,
  natural_join: naturalJoin,
  natural_left_join: naturalLeftJoin,
  case: caseClause,
  coalesce: coalesce,
  json_agg: jsonAgg,
  json_merge_agg: jsonMergeAgg,
  json_obj: jsonObj
};

module.exports = { select, insert, update, complexParse, fromClause, whereClause, filter, sub, coalesce, jsonAgg, jsonObj, getValueList }
