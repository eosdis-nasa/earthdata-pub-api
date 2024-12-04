const fetch = require('node-fetch');
const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getNewSubmissionTemplate } = require('./templates/new-submission');
const { getNewSubmissionDAACTemplate } = require('./templates/new-submission-daac');
const { getDMTemplate } = require('./templates/direct-message');
const { getReviewerAddedTemplate } = require('./templates/review-template');

const svgUrl = 'https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg';

const toBase64 = async (response) => {
  const buffer = await response.buffer();
  return buffer.toString('base64');
};

const fetchSvgAndConvertToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const base64EncodedData = await toBase64(response);
    return `data:image/svg+xml;base64,${base64EncodedData}`;
  } catch (error) {
    console.error('Error fetching or converting SVG:', error);
    return null; // return null or a default image URL in case of an error
  }
};

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
    const svgDataUri = await fetchSvgAndConvertToBase64(svgUrl);
    return getReviewerAddedTemplate(params, envUrl, svgDataUri);
  }
  return getDefaultStepPromotion(params, envUrl);
};

module.exports.createEmailHtml = createEmailHtml;
