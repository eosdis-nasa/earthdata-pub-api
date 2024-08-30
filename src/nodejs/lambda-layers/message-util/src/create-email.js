const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getNewSubmissionTemplate } = require('./templates/new-submission');
const { getNewSubmissionDAACTemplate } = require('./templates/new-submission-daac');
const { getDMTemplate } = require('./templates/direct-message');
const { getReviewerAddedTemplate } = require('./templates/review-template');

const envUrl = process.env.ROOT_URL;

const createEmailHtml = async (params) => {
  if (params.customTemplateFunction) {
    return params.customTemplateFunction(params, envUrl);
  }
  if (params.eventMessage.event_type.match(/direct_message/gi)) {
    return getDMTemplate(params, envUrl);
  } if (params.eventMessage.event_type.match(/request_initialized/gi)) {
    return (params.user.initiator
      ? getNewSubmissionTemplate(params, envUrl) : getNewSubmissionDAACTemplate(params, envUrl));
  } if (params.eventMessage.event_type === 'review_required') {
    return getReviewerAddedTemplate(params, envUrl);
  }
  return getDefaultStepPromotion(params, envUrl);
};

module.exports.createEmailHtml = createEmailHtml;
