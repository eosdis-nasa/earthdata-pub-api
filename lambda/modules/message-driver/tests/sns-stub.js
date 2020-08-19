const spy = {};

function publish(p, c) {
  spy.params = p;
  c(null, p);
}

module.exports.publish = publish;
module.exports.spy = spy;
