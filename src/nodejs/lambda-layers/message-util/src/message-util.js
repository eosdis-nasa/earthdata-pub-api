const { SNS } = require('@aws-sdk/client-sns');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const uuid = require('uuid');
const { createEmailHtml } = require('./create-email');

const sourceEmail = process.env.SOURCE_EMAIL;
const eventSns = process.env.EVENT_SNS;
const metricsSns = process.env.METRICS_SNS;
const eventGroupId = 'edpub-event-group';
// const sesAccessKeyId = process.env.SES_ACCESS_KEY_ID;
// const sesSecretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

const sns = new SNS({
  ...(process.env.SNS_ENDPOINT && { endpoint: process.env.SNS_ENDPOINT })
});

function marshalAttribute(attribute) {
  if (Array.isArray(attribute)) {
    return { DataType: 'String.Array', StringValue: JSON.stringify(attribute) };
  } if (typeof attribute === 'string') {
    return { DataType: 'String', StringValue: attribute };
  } if (typeof attribute === 'number') {
    return { DateType: 'Number', StringValue: `${attribute}` };
  }
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
  return secretClient.send(secretCmd);
}

async function getSESClient() {
  const secretsResponse = await getSecretsValues();
  const sesCreds = JSON.parse(secretsResponse.SecretString);
  return new SESClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: sesCreds.ses_access_key_id,
      secretAccessKey: sesCreds.ses_secret_access_key
    }
  });
}

async function sendEmail(users, eventMessage) {
  const ses = await getSESClient();
  users.forEach(async (user) => {
    const bodyArray = await createEmailHtml({ user, eventMessage });
    const payload = {
      Source: sourceEmail,
      Destination: {
        ToAddresses: [user.email]
      },
      Message: {
        Subject: {
          Data: 'EDPUB Notification'
        },
        Body: {
          Text: {
            Data: bodyArray[0]
          },
          Html: {
            Data: bodyArray[1]
          }
        }
      }
    };
    // eslint-disable-next-line
    console.log('sendEmail Html', bodyArray[1]);
    // eslint-disable-next-line
    console.log('sendEmail Text', bodyArray[0]);
    await ses.send(new SendEmailCommand(payload));
  });
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
