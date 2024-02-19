const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getNewSubmissionTemplate } = require('./templates/new-submission');
const { getDMTemplate } = require('./templates/direct-message');

const createEmailHtml = async (params) => {
  if (params.eventMessage.event_type.match(/direct_message/gi)) {
    return getDMTemplate(params);
  } if (params.eventMessage.event_type.match(/request_initialized/gi)) {
    return getNewSubmissionTemplate(params);
  }
  return getDefaultStepPromotion(params);
};

module.exports.createEmailHtml = createEmailHtml;
