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
    return { DataType: 'Number', StringValue: `${attribute}` };
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
  try {
    return secretClient.send(secretCmd);
  } catch (err) {
    console.error('Error getting secrets:', err);
    return ({ error: 'Error getting secrets' });
  }
}

async function send(user, eventMessage, customTemplateFunction, ses, urlLogo) {
  try {
    const bodyArray = await createEmailHtml({
      user, eventMessage, customTemplateFunction, urlLogo
    });

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
            Data: bodyArray[0],
            Charset: 'UTF-8'
          },
          Html: {
            Data: bodyArray[1],
            Charset: 'UTF-8'
          }
        }
      }
    };
    const command = new SendEmailCommand(payload);
    await ses.send(command);
    return { success: true };
  } catch (err) {
    console.error(`Error sending email to ${user.email}:`, err);
    return ({ error: 'Error sending email ' });
  }
}

async function sendEmail(users, eventMessage, customTemplateFunction) {
  try {
    const secretsResponse = await getSecretsValues();
    const sesCreds = JSON.parse(secretsResponse.SecretString);
    const ses = new SESClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: sesCreds.ses_access_key_id,
        secretAccessKey: sesCreds.ses_secret_access_key
      }
    });
    const logoUrl = 'https://earthdatapub-dashboard-sit.s3.us-west-2.amazonaws.com/images/app/src/assets/images/nasa_test.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQXSOCK3LCTPCLEDN%2F20241206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241206T072705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHAaCXVzLXdlc3QtMiJHMEUCIFtHNSblu37yqA1BEe0QXOSF5Eyn60Tpb1hm7mdD0lToAiEA4fz5Z4jGoUTV9NbOD8SH9msnj90RvFNvdBvVAHB5Ljcq6AIIKRADGgwwNTA2Mjk1OTY4ODYiDCLFgXkXDmz7sFZC%2BCrFAom2tQYZ2xm7pQ6rDrYbXRyVf40BtF6iQrfIyldYZm3JwlEzyJp29PvcBWBkfQB6266pfw2892%2FrxlrHTwyxXuS001ftUVEBmeaAM2Y4EWo3ncehqy0%2Fe4yjEGNOLoupgbFEyJ9RxZJYsEaNF1aIj2teAPo3EdRZXLDCiwe7poS9wSpRV8edz7zy5H8yA6maQGmnXhW8JNlJuWF%2BEHR4XwVCIg0uKHjLgzpQ3BE%2BJwau%2B7tM%2FmSsi6LiW29tloBHsE2cxy9ikqo3BrkIqFs1dOAKS%2B8eT%2Bc3qRMrntrchbI26kHoJDmBphA%2F%2Bpb4XOca1InDCwEzN6LHrV14ufwaDwwehyurag6lO3Hvux4eUoUtgLTpKfjLDaKcmNZ38rcb8NKAVaCjOCP3E47TQqXKCOCyMhA5kIRTU1HJNiOEQf8U0ek173UwyM7KugY6ngEvYwOKgwZMtGXr7Q3gZ1dBffQRJ%2FwpD6HbFCFRDgDUIWSywEwgm3Im6XpGGQw51%2FAUsCeK0l2CzE6kzdGMcvQet%2BbZUMT5cvED0PnYHi7CducP0237vixhdENjD2mDEd6zWWnF5EaiYWrsSV%2FPwRdUaptnUo4TfGIwDFPRSnrS70RWMIPh9nKRZqxW%2BWw8A2zjRHEEWNFpQrArxs%2Fslg%3D%3D&X-Amz-Signature=25e67f6adcd9be3696e8c4c50a293a2bd0222a07da49acdd7abb4f581ee490a9&X-Amz-SignedHeaders=host&x-id=GetObject';
    const promises = users.map(
      (user) => send(user, eventMessage, logoUrl, customTemplateFunction, ses)
    );
    await Promise.all(promises);
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
