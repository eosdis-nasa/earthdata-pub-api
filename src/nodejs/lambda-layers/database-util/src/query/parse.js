function one([row]) {
  return row;
}

function many(rows) {
  return rows;
}

module.exports.findById = one;
module.exports.findAll = many;
module.exports.findAllEx = many;
module.exports.putItem = one;
module.exports.updateMetadata = one;
module.exports.updateFormData = one;
module.exports.initialize = one;
module.exports.getState = one;
module.exports.promoteStep = one;
module.exports.applyWorkflow = one;
module.exports.loginUser = one;
module.exports.reply = one;
module.exports.sendNote = one;
module.exports.metricsFilter = many;
module.exports.metricsStats = many;
module.exports.subscribe = one;
module.exports.unsubscribe = one;
module.exports.putMetric = one;
