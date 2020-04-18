const db = require('./db_sample.json');

class DocumentClientStub {
  constructor(query, put) {
    this.query = query;
    this.put = put;
  }
}

module.exports.DocumentClientStub = DocumentClientStub;
module.exports.noResults = () => {
  const query = (p, c) => {
    c(undefined, { Items: [], Count: 0 });
  };
  const put = (p, c) => { c(); };
  const client = new DocumentClientStub(query, put);
  return client;
};
module.exports.client = () => {
  const query = (p, c) => {
    const data = [];
    let err;
    const table = p.TableName;
    const { ':id': id, ':unique_name': un, ':version': vr } = p.ExpressionAttributeValues;
    if (id) {
      const item = db[table][id];
      if (item) data.push(item);
    } else if (un) {
      Object.values(db[table]).forEach((item) => {
        if (item.unique_name === un) data.push(item);
      });
    } else if (un && vr) {
      Object.values(db[table]).forEach((item) => {
        if (item.unique_name === un && item.version === vr) data.push(item);
      });
    }
    c(err, { Items: data, Count: data.length });
  };
  const put = (p, c) => {
    const data = [];
    let err;
    db[p.TableName][p.Item.id] = p.Item;
    c(err, { Items: data, Count: data.length });
  };
  return new DocumentClientStub(query, put);
};
