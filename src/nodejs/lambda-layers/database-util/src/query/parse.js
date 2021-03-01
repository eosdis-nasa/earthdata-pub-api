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
module.exports.getUsersSubmissions = many;
module.exports.initialize = one;
module.exports.getState = one;
module.exports.promoteStep = one;
module.exports.applyWorkflow = one;
module.exports.loginUser = one;
module.exports.addRole = one;
module.exports.addGroup = one;
module.exports.getEmails = many;
module.exports.metricsFilter = many;
module.exports.metricsStats = many;
module.exports.subscribe = one;
module.exports.unsubscribe = one;
module.exports.putMetric = one;
module.exports.getNoteByPostId = one;
module.exports.linkPostId = one;
module.exports.getConversationByTicketId = one;
module.exports.linkTicketId = one;
module.exports.getConversationList = many;
module.exports.readConversation = many;
module.exports.reply = one;
module.exports.sendNote = one;
