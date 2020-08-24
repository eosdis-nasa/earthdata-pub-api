const spy = {};

function sendMessage(p, c) {
  spy.params = p;
  c(null, p);
}

module.exports.sendMessage = sendMessage;
module.exports.spy = spy;
