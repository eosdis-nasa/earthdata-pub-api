const https = require('https');
const { getDefaultStepPromotion } = require('./templates/default-step-promotion');
const { getNewSubmissionTemplate } = require('./templates/new-submission');
const { getNewSubmissionDAACTemplate } = require('./templates/new-submission-daac');
const { getDMTemplate } = require('./templates/direct-message');
const { getReviewerAddedTemplate } = require('./templates/review-template');

const toBase64 = (buffer) => Buffer.from(buffer).toString('base64');

const fetchSvgAndConvertToBase64 = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      reject(new Error(`StatusCode=${res.statusCode}`));
    }
    const data = [];
    res.on('data', (chunk) => data.push(chunk));
    res.on('end', () => {
      try {
        const buffer = Buffer.concat(data);
        const base64EncodedData = toBase64(buffer);
        resolve(`data:image/svg+xml;base64,${base64EncodedData}`);
      } catch (e) {
        reject(e);
      }
    });
  }).on('error', (e) => {
    reject(e);
  });
});

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
    const svgUrl = 'https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg';
    try {
      const svgDataUri = await fetchSvgAndConvertToBase64(svgUrl);
      return getReviewerAddedTemplate(params, envUrl, svgDataUri);
    } catch (error) {
      console.error('Failed to fetch or convert SVG:', error);
      return getReviewerAddedTemplate(params, envUrl); // Ensuring return in all paths
    }
  }
  return getDefaultStepPromotion(params, envUrl); // Ensuring return in all paths
};

module.exports.createEmailHtml = createEmailHtml;
