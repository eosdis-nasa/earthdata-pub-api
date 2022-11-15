function one({ rows: [row] }) {
  return row;
}

function many({ rows }) {
  return rows;
}

module.exports.find = many;
module.exports.findById = one;
module.exports.findByName = one;
module.exports.findAll = many;
module.exports.findAllEx = many;
module.exports.findAllWithInterface = many;
module.exports.putItem = one;
module.exports.update = one;
module.exports.updateName = one;
module.exports.updateDaac = one;
module.exports.updateConversation = one;
module.exports.updateMetadata = one;
module.exports.updateFormData = one;
module.exports.getUsersSubmissions = many;
module.exports.getDaacSubmissions = many;
module.exports.getAdminSubmissions = many;
module.exports.initialize = one;
module.exports.getState = one;
module.exports.promoteStep = one;
module.exports.applyWorkflow = one;
module.exports.rollback = one;
module.exports.loginUser = one;
module.exports.getRefreshToken = one;
module.exports.refreshUser = one;
module.exports.addRole = one;
module.exports.addRoles = one;
module.exports.removeRole = one;
module.exports.addGroup = one;
module.exports.addGroups = one;
module.exports.removeGroup = one;
module.exports.getEmails = many;
module.exports.findSystemUser = one;
module.exports.metricsFilter = many;
module.exports.metricsStats = many;
module.exports.subscribe = one;
module.exports.unsubscribe = one;
module.exports.putMetric = one;
module.exports.getConversationList = many;
module.exports.readConversation = one;
module.exports.reply = one;
module.exports.sendNote = one;
module.exports.addUsersToConversation = many;
module.exports.addUserToConversation = one;
module.exports.reassignWorkflow = one;
module.exports.withdrawSubmission = one;
module.exports.restoreSubmission = one;
module.exports.add = one;
module.exports.updateInput = one;
module.exports.findSecret = one;
module.exports.deleteSecret = one;
module.exports.deleteInput = one;
module.exports.setStep = one;
module.exports.checkWorkflow = one;
module.exports.getContributors = many;