let db = require("./db_sample.json");

class DocumentClientStub {
  constructor(query, put) {
    this.query = query;
    this.put = put;
  }
}

module.exports.DocumentClientStub = DocumentClientStub;
module.exports.noResults = () => {
  let query = (p, c) => {
    c(undefined, {Items:[], Count: 0});
  }
  let put = (p, c) => {c()}
  let client = new DocumentClientStub(query, put);
  return client;
}
module.exports.client = () => {
  let query = (p, c) => {
    let data = [];
    let err;
    let table = p.TableName;
    let {":id":id, ":unique_name":un, ":version":vr} = p.ExpressionAttributeValues;
    if(id) {
      let item = db[table][id];
      if (item) data.push(item);
    }
    else if(un) {
      for (item of Object.values(db[table])) {
        if (item.unique_name == un) data.push(item);
      }
    }
    else if(un && vr) {
      for (item of Object.values(db[table])) {
        if (item.unique_name == un && item.version == vr) data.push(item);
      }
    }
    c(err, {Items: data, Count: data.length});
  }
  let put = (p, c) => {
    let data = [];
    let err;
    db[p.TableName][p.Item.id] = p.Item;
    c(err, {Items: data, Count: data.length});
  }
  return new DocumentClientStub(query, put);
}
