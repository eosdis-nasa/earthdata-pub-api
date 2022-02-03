const opTypes = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  or: 'OR',
  '||': 'OR',
  and: 'AND',
  '&&': 'AND',
  not: 'NOT',
  '!': 'NOT',
  is_not: 'IS NOT',
  is: 'IS'
};

const complexParse = (src) => complexTypes[src.type](src);

const typeCheck = (stub) => `${stub.type ? complexParse(stub) : stub.param ? param(stub) : stub}`;

const selectQuery = ({
  fields, from, where, group, sort, order, limit, offset, alias
}) => `${alias ? '(' : ''}SELECT${fields
  ? ` ${fields.map(typeCheck)}` : ' *'}${from
  ? fromClause(from) : ''}${where
  ? whereClause(where) : ''}${group
  ? ` GROUP BY ${group}` : ''}${sort
  ? ` ORDER BY ${sort}${order ? ` ${order}` : ''}` : ''}${limit
  ? ` LIMIT ${limit}${offset
  ? ` OFFSET ${offset * limit}` : ''}` : ''}${alias
  ? `) ${alias}` : ''}`;

const insertQuery = ({
  table, values, conflict, returning
}) => `INSERT INTO ${typeCheck(table)} ${typeCheck(values)}${conflict
  ? onConflict(conflict) : ''}${returning
  ? returningClause(returning) : ''}`;

const updateQuery = ({
  table, set, where, returning
}) => `UPDATE ${table ? `${table} ` : ''}SET ${set.map(filter).join(',')}${where
  ? whereClause(where) : ''}${returning
  ? returningClause(returning) : ''}`;

const deleteQuery = ({
  table, where, returning
}) => `DELETE FROM ${table}${where
  ? whereClause(where) : ''}${returning
  ? returningClause(returning) : ''}`;

const onConflict = ({ constraints, update }) => ` ON CONFLICT ${constraints ? `(${constraints.join(',')}) ` : ''} DO ${update
  ? typeCheck(update) : 'NOTHING'}`;

const returningClause = (field) => ` RETURNING ${field.join(',')}`;

const shortTable = ({ base, field }) => `${base}(${field.join(',')})`;

const valuesList = ({ items }) => ` VALUES(${items.map(typeCheck).join(',')})`;

const param = ({ param }) => `{{${param}}}`;

const fromClause = ({ base, joins }) => ` FROM ${base}${joins ? joins.map(complexParse).join(' ') : ''}`;

const whereClause = ({ filters }) => (filters.length > 0 ? ` WHERE ${filters.map(filter).join(' AND ')}` : '');

const caseClause = ({ when, alias }) => `${alias ? '(' : ''}CASE ${when.map(whenClause).join('')} END${alias
  ? `) ${alias}` : ''}`;

const whenClause = ({ field, value, result }) => ` WHEN ${field} = '${value}' THEN '${result}'`;

const anyClause = ({ values }) => ` ANY(${typeCheck(values)})`;

const leftJoin = ({ src, on }) => ` LEFT JOIN ${src.type ? complexParse(src) : src}${on
  ? ` ON ${on.left} = ${on.right}` : ''}`;

const naturalJoin = ({ src }) => ` NATURAL JOIN ${src.type ? complexParse(src) : src}`;

const naturalLeftJoin = ({ src, on }) => ` NATURAL LEFT JOIN ${src.type ? complexParse(src) : src}`;

const filter = ({
  logOp, field, like, op, value, param, any, literal, cmd,
}) => cmd ? `${cmd}` : like ? `${field} ILIKE '%' || {{${like}}} || '%'` :
  `${logOp ? ` ${opTypes[logOp]}` : ''} ${field} ${opTypes[op] || '='} ${literal
    ? strWrapper(literal) : value
    ? typeCheck(value) : any
    ? anyClause(any) : ` {{${param || field}}}`}`;

const sub = ({ query, alias }) => `(${query})${alias ? ` ${alias}` : ''}`;

const coalesce = ({ src, fallback, alias }) => ` COALESCE(${src.type ? complexParse(src) : src}, ${fallback})${alias
  ? ` ${alias}` : ''}`;

const jsonAgg = ({
  src, distinct, sort, order, filters, alias
}) => `JSONB_AGG(${distinct ? 'DISTINCT ': ''}${typeCheck(src)}${sort
  ? ` ORDER BY ${sort}${order ? ` ${order}` : ''}` : ''})${filters
    ? `FILTER (${whereClause({ filters })})` : ''}${alias
  ? ` ${alias}` : ''}`;

const jsonMergeAgg = ({
  src, sort, order, alias
}) => `JSONB_MERGE_AGG(${src.type ? complexParse(src) : src}${sort
  ? ` ORDER BY ${sort}${order ? ` ${order}` : ''}` : ''})${alias
  ? ` ${alias}` : ''}`;

const jsonObj = ({ keys, alias, strip }) => `${strip ? 'JSONB_STRIP_NULLS(' : ''}JSONB_BUILD_OBJECT(${keys.map(([key, src]) => `'${key}', ${src.type ? complexParse(src) : src}`)})${strip ? ')' : ''}${alias
  ? ` ${alias}` : ''}`;

const strWrapper = (value) => ` '${value}'`;

const strLiteral = ({ value }) => strLiteral(value);

const complexTypes = {
  select: selectQuery,
  insert: insertQuery,
  update: updateQuery,
  delete: deleteQuery,
  values_list: valuesList,
  short_table: shortTable,
  param,
  left_join: leftJoin,
  natural_join: naturalJoin,
  natural_left_join: naturalLeftJoin,
  case: caseClause,
  coalesce,
  json_agg: jsonAgg,
  json_merge_agg: jsonMergeAgg,
  json_obj: jsonObj,
  literal: strLiteral
};

module.exports = complexTypes;
