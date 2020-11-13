module.exports.eventSns = process.env.EVENT_SNS;

module.exports.snsConfig = {
  ...(process.env.SNS_ENDPOINT && { endpoint: process.env.SNS_ENDPOINT })
};
