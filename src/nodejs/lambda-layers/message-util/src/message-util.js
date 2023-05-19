const { SNS } = require('@aws-sdk/client-sns');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const uuid = require('uuid');

const sourceEmail = process.env.SOURCE_EMAIL;
const eventSns = process.env.EVENT_SNS;
const metricsSns = process.env.METRICS_SNS;
const eventGroupId = 'edpub-event-group';
const sesAccessKeyId = process.env.SES_ACCESS_KEY_ID;
const sesSecretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

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

async function sendEmail(users, eventMessage) {
  const ses = new SESClient({
    region: 'us-east-1',
    credentials: { accessKeyId: sesAccessKeyId, secretAccessKey: sesSecretAccessKey }
  });

  users.forEach(async (user) => {
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
            Data: `Hello ${user.name},\n\nThe following request has changed step in the ${eventMessage.workflow_name} workflow.\n\nRequest:\n${eventMessage.submission_name} (${eventMessage.submission_id})\n\nNew Step:\n${eventMessage.step_name}\n\nComments:\n${eventMessage.conversation_subject} ${eventMessage.conversation_last_message}`
          },
          Html: {
            Data: `
              <html>
              <body>
                  <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style>
                  <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
                      <tr style="width:100%;background:#f8f8f8">
                          <td><table><tr>
                              <td width="60"><img src="https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg"></td>
                              <td><h4>Earthdata Pub</h4></td>
                          </tr></table></td>
                          <td align="right"><b>Step Change</b></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="padding:20px;">
                              <h1>Hello ${user.name},</h1><br>
                              <br>
                              <p>The following request has changed step in the ${eventMessage.workflow_name} workflow.</p>
                              <h2>Request:</h2>
                              <p>${eventMessage.submission_name} (${eventMessage.submission_id})<br>
                              <a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard/requests/id/${eventMessage.submission_id}" aria-label="View the request">Go to request</a></p>
                              <h2>New Step:</h2>
                              <p>${eventMessage.step_name}</p>
                              <h2>Comments:</h2> 
                              <p>${eventMessage.conversation_subject} ${eventMessage.conversation_last_message}</p>
                              <br><br>
                              <p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard" aria-label="Visit Earthdata Pub Dashboard">https://pub.earthdata.nasa.gov/dashboard</a></p>
                          </td>
                      </tr>
                  </table>
              </body>
              </html> 
            `
          }
        }
      }
    };

    const command = new SendEmailCommand(payload);
    await ses.send(command);
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
