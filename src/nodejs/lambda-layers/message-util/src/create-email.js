const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getDMTemplate } = require('./templates/direct-message');
const { getReviewerAddedTemplate } = require('./templates/review-template');
const { getAssignedDaacCodeTemplate } = require('./templates/assigned-daac-codes.js');
const { getNewSubmissionInternalTemplate } = require('./templates/new-submission-internal.js');

const envUrl = process.env.ROOT_URL;

const createEmailHtml = async (params) => {
  if (params.customTemplateFunction) {
    return params.customTemplateFunction(params, envUrl);
  }
  switch (params.eventMessage.event_type) {
    case 'direct_message': return getDMTemplate(params, envUrl);
    case 'review_required': return getReviewerAddedTemplate(params, envUrl);
    case 'daac_assignment': return getAssignedDaacCodeTemplate(params, envUrl);
    case 'form_submitted': return getNewSubmissionInternalTemplate(params, envUrl);
    default: return getDefaultStepPromotion(params, envUrl);
  }
};

module.exports.createEmailHtml = createEmailHtml;
