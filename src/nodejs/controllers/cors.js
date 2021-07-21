function optionsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.end();
}

module.exports.optionsDataAction = optionsHeaders;

module.exports.optionsDataActions = optionsHeaders;

module.exports.optionsDataDaac = optionsHeaders;

module.exports.optionsDataDaacs = optionsHeaders;

module.exports.optionsDataForm = optionsHeaders;

module.exports.optionsDataForms = optionsHeaders;

module.exports.optionsDataGroup = optionsHeaders;

module.exports.optionsDataGroups = optionsHeaders;

module.exports.optionsDataRole = optionsHeaders;

module.exports.optionsDataRoles = optionsHeaders;

module.exports.optionsDataNote = optionsHeaders;

module.exports.optionsDataNotes = optionsHeaders;

module.exports.optionsDataQuestion = optionsHeaders;

module.exports.optionsDataQuestions = optionsHeaders;

module.exports.optionsDataService = optionsHeaders;

module.exports.optionsDataServices = optionsHeaders;

module.exports.optionsDataSubmission = optionsHeaders;

module.exports.optionsDataSubmissions = optionsHeaders;

module.exports.optionsDataUser = optionsHeaders;

module.exports.optionsDataUsers = optionsHeaders;

module.exports.optionsDataWorkflow = optionsHeaders;

module.exports.optionsDataWorkflows = optionsHeaders;

module.exports.optionsNotify = optionsHeaders;

module.exports.optionsSubscribe = optionsHeaders;

module.exports.optionsModule = optionsHeaders;

module.exports.optionsModuleList = optionsHeaders;

module.exports.optionsInvoke = optionsHeaders;

module.exports.optionsRegister = optionsHeaders;

module.exports.optionsSubmission = optionsHeaders;

module.exports.optionsMetrics = optionsHeaders;

module.exports.optionsMetricsGetReport = optionsHeaders;

module.exports.optionsMetricsListReports = optionsHeaders;

module.exports.optionsModel = optionsHeaders;

module.exports.optionsToken = optionsHeaders;

module.exports.optionsVersion = optionsHeaders;
