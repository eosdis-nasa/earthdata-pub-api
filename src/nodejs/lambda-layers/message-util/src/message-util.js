const { SNS } = require('@aws-sdk/client-sns');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const uuid = require('uuid');
const { createEmailHtml } = require('./create-email');

const sourceEmail = process.env.SOURCE_EMAIL;
const eventSns = process.env.EVENT_SNS;
const metricsSns = process.env.METRICS_SNS;
const eventGroupId = 'edpub-event-group';
// const sesAccessKeyId = process.env.SES_ACCESS_KEY_ID;
// const sesSecretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

// Helper function to read a stream into a buffer
const streamToBuffer = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('end', () => resolve(Buffer.concat(chunks)));
  stream.on('error', reject);
});

// Helper to fetch attachment as base64
const getAttachmentAsBase64String = async ({ bucket, key }) => {
  const s3 = new S3Client();

  try {
    const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const buffer = await streamToBuffer(response.Body);
    return buffer.toString('base64');
  } catch (error) {
    console.error(`Failed to fetch S3 object: ${error.message}`);
    throw error;
  }
};

// Generate the raw email with attachment
const getRawFromTemplate = ({
  subject,
  from,
  to,
  htmlText,
  nasaLogo
}) => `MIME-Version: 1.0
Content-Type: multipart/mixed; boundary=EDPUB_BOUNDARY
From: <${from}>
To: <${to}>
Subject: ${subject}

--EDPUB_BOUNDARY
Content-Type: text/html; charset=utf-8

${htmlText}

--EDPUB_BOUNDARY
Content-Type: image/png
Content-ID: <NASALogo>
Content-Transfer-Encoding: base64
Content-Disposition: inline; filename="nasa_logo.png"

${nasaLogo}

--EDPUB_BOUNDARY--`;

const sns = new SNS({
  ...(process.env.SNS_ENDPOINT && { endpoint: process.env.SNS_ENDPOINT })
});

function marshalAttribute(attribute) {
  if (Array.isArray(attribute)) {
    return { DataType: 'String.Array', StringValue: JSON.stringify(attribute) };
  } if (typeof attribute === 'string') {
    return { DataType: 'String', StringValue: attribute };
  } if (typeof attribute === 'number') {
    return { DataType: 'Number', StringValue: `${attribute}` };
  }
  // eslint-disable-next-line no-console
  console.log('marshalAttribute: Unsupported attribute type', attribute);
  return {};
}

function marshalAttributes(eventMessage) {
  return Object.entries(eventMessage).reduce((attributes, [key, val]) => {
    if (key !== 'data') {
      Object.assign(attributes, { [key]: marshalAttribute(val) });
    }
    return attributes;
  }, {});
}

async function getSecretsValues() {
  const secretClient = new SecretsManagerClient();
  const secretCmd = new GetSecretValueCommand({ SecretId: 'ses_access_creds' });
  try {
    return secretClient.send(secretCmd);
  } catch (err) {
    console.error('Error getting secrets:', err);
    return ({ error: 'Error getting secrets' });
  }
}

function exponentialBackoff(increment) {
  // Base the backoff on 5 seconds per try
  const base = 5000;
  // 1 minute max  - wont trigger with 5s base and only 3 retry limit, but safety net
  const maxBackoff = 60000;
  // Not implementing a Jitter because this is expected to be rare.
  // If backoffs becomes a common thing implementing a jitter would be recommended.
  const backoffVal = Math.min(base * 2 ** increment, maxBackoff);

  return new Promise((resolve) => setTimeout(resolve, backoffVal));
}

async function send(user, eventMessage, customTemplateFunction, ses) {
  try {
    const bodyArray = await createEmailHtml({ user, eventMessage, customTemplateFunction });
    const nasaLogo = await getAttachmentAsBase64String({
      bucket: process.env.DASHBOARD_BUCKET,
      key: 'images/app/src/assets/images/nasa-logo.d7dbc5e408ccd79bb7578f3358413d69.png'
    });

    const rawEmail = getRawFromTemplate({
      subject: 'Earthdata Pub Notification',
      from: sourceEmail,
      to: user.email,
      image: nasaLogo,
      imageName: 'nasa_logo.png',
      htmlText: bodyArray[1],
      plainText: bodyArray[0],
      nasaLogo
    });

    const secretsResponse = await getSecretsValues();
    const sesCreds = JSON.parse(secretsResponse.SecretString);
    const command = new SendEmailCommand({
      Content: {
        Raw: {
          Data: new TextEncoder().encode(rawEmail)
        }
      },
      ConfigurationSetName: sesCreds.ses_configuration_set_name,
      FromEmailAddressIdentityArn: sesCreds.ses_secret_sender_arn
    });
    const maxRetries = 3;
    let currentTry = 0;
    do {
      try {
        await ses.send(command);
        return { success: true };
      } catch (e) {
        if (e.name === 'ThrottlingException' && e.message.includes('Maximum sending rate exceeded')) {
          // eslint-disable-next-line
          console.log('Maximum send rate exceeded when sending email. Backing off.');
          await exponentialBackoff(currentTry);
        } else {
          throw e;
        }
      }
      currentTry += 1;
    } while (currentTry < maxRetries);
    // If we've broken out of the loop because we've exceeded the num max retries log an error
    if (currentTry >= maxRetries) {
      throw new Error('Backoff limits exceeded');
    }
  } catch (err) {
    console.error(`Error sending email to ${user.email}:`, err);
    throw err;
  }
  return ({ error: 'Error sending email ' });
}

async function sendEmail(users, eventMessage, customTemplateFunction) {
  try {
    const ses = new SESv2Client({
      region: 'us-east-1'
    });
    const promises = users.map((user) => send(user, eventMessage, customTemplateFunction, ses));
    let rejectedCount = 0;
    await Promise.allSettled(promises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          rejectedCount += 1;
        }
      });
    });
    if (rejectedCount > 0) {
      return { error: `${rejectedCount} errors encountered in sendEmail` };
    }
    return { success: true };
  } catch (err) {
    console.error('Error in sendEmail:', err);
    return ({ error: 'Error sendEmail' });
  }
}

function sendEvent(eventMessage) {
  const params = {
    Subject: 'event',
    Message: JSON.stringify(eventMessage),
    MessageAttributes: marshalAttributes(eventMessage),
    MessageGroupId: eventGroupId,
    MessageDeduplicationId: Date.now().toString(),
    TopicArn: eventSns
  };
  const response = sns.publish(params).catch((e) => { console.error(e); });
  return response;
}

function sendMetric(eventMessage) {
  const { data, ...cleanedMessage } = eventMessage;
  cleanedMessage.message_id = uuid.v4();
  const params = {
    Subject: 'metric',
    Message: JSON.stringify(cleanedMessage),
    TopicArn: metricsSns
  };
  const response = sns.publish(params).catch((e) => { console.error(e); });
  return response;
}

function parseAttributesFromParams(params) {
  const attributes = {
    ...(params.action && { action_id: params.action.id }),
    ...(params.conversation && { conversation_id: params.conversation.id }),
    ...(params.daac && { daac_id: params.daac.id }),
    ...(params.form && { form_id: params.form.id }),
    ...(params.group && { group_id: params.group.id }),
    ...(params.question && { question_id: params.question.id }),
    ...(params.role && { role_id: params.role.id }),
    ...(params.service && { service_id: params.service.id }),
    ...(params.submission && { submission_id: params.submission.id }),
    ...(params.user && { user_id: params.user.id }),
    ...(params.workflow && { workflow_id: params.workflow.id })
  };
  return attributes;
}

function parseSnsMessage(message) {
  return {
    subject: message.Subject,
    eventMessage: JSON.parse(message.Message),
    timestamp: new Date(message.Timestamp).toISOString()
  };
}

function parseSqsMessage(message) {
  const body = JSON.parse(message.body);
  if (body.TopicArn) {
    return parseSnsMessage(body);
  }
  const unixTime = parseInt(message.attributes.SentTimestamp, 10);
  const timestamp = new Date(unixTime).toISOString();
  return {
    eventMessage: body,
    timestamp
  };
}

function parseRecord(record) {
  if (record.Sns) {
    return parseSnsMessage(record.Sns);
  }
  return parseSqsMessage(record);
}

module.exports.sendEmail = sendEmail;
module.exports.sendEvent = sendEvent;
module.exports.sendMetric = sendMetric;
module.exports.parseRecord = parseRecord;
module.exports.parseAttributesFromParams = parseAttributesFromParams;
