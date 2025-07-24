const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getDMTemplate } = require('./templates/direct-message');
const { getReviewerAddedTemplate } = require('./templates/review-template');
const { getAssignedDaacCodeTemplate } = require('./templates/assigned-daac-codes.js');

const envUrl = process.env.ROOT_URL;

const createEmailHtml = async (params) => {
  if (params.customTemplateFunction) {
    return params.customTemplateFunction(params, envUrl);
  }
  if (params.eventMessage.event_type.match(/direct_message/gi)) {
    return getDMTemplate(params, envUrl);
  }
  if (params.eventMessage.event_type === 'review_required') {
    return getReviewerAddedTemplate(params, envUrl);
  }
  if (params.eventMessage.event_type === 'daac_assignment') {
    return getAssignedDaacCodeTemplate(params, envUrl);
  }
  return getDefaultStepPromotion(params, envUrl);
};

module.exports.createEmailHtml = createEmailHtml;
