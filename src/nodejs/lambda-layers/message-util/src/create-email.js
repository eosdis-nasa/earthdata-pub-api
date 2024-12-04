const https = require('https');
const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getNewSubmissionTemplate } = require('./templates/new-submission');
const { getNewSubmissionDAACTemplate } = require('./templates/new-submission-daac');
const { getDMTemplate } = require('./templates/direct-message');
const { getReviewerAddedTemplate } = require('./templates/review-template');

const fetchSvgContent = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      reject(new Error(`Request failed with status code ${res.statusCode}`));
      return; // Necessary for consistent behavior
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const envUrl = process.env.ROOT_URL;

const createEmailHtml = async (params) => {
  if (params.customTemplateFunction) {
    return params.customTemplateFunction(params, envUrl);
  }

  if (params.eventMessage.event_type.match(/direct_message/gi)) {
    return getDMTemplate(params, envUrl);
  }

  if (params.eventMessage.event_type.match(/request_initialized/gi)) {
    return params.user.initiator
      ? getNewSubmissionTemplate(params, envUrl)
      : getNewSubmissionDAACTemplate(params, envUrl);
  }

  if (params.eventMessage.event_type === 'review_required') {
    const svgUrl = 'https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg';
    try {
      const svgContent = await fetchSvgContent(svgUrl);
      return getReviewerAddedTemplate(params, envUrl, svgContent);
    } catch (error) {
      console.error('Error fetching SVG:', error.message);
      return getReviewerAddedTemplate(params, envUrl);
    }
  }

  return getDefaultStepPromotion(params, envUrl);
};

module.exports.createEmailHtml = createEmailHtml;
