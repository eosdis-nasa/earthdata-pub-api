const db = require('./sample.js');

const spy = {};

function query(p, c) {
  spy.params = p;
  c(null, { Items: db.questions });
}

function putItem(p, c) {
  spy.params = p;
  c(null, p);
}

function deleteItem(p, c) {
  spy.params = p;
  c(null, p);
}

function updateItem(p, c) {
  spy.params = p;
  c(null, p);
}

module.exports.query = query;
module.exports.putItem = putItem;
module.exports.deleteItem = deleteItem;
module.exports.updateItem = updateItem;
module.exports.spy = spy;
