const { SNS } = require('@aws-sdk/client-sns');
const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { SESv2Client } = require('@aws-sdk/client-sesv2');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const uuid = require('uuid');

const eventSns = process.env.EVENT_SNS;
const metricsSns = process.env.METRICS_SNS;
const eventGroupId = 'edpub-event-group';

// const sesAccessKeyId = process.env.SES_ACCESS_KEY_ID;
// const sesSecretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

const getRawFromTemplate = ({
  subject, from, to, htmlText, image, imageName, nasaLogo
}) => `MIME-Version: 1.0
Content-Type: multipart/mixed;boundary=EDPUB_BOUNDARY
From: <${from}>
To: <${to}>
Subject: ${subject}

--EDPUB_BOUNDARY
Content-Type: text/html;charset=utf-8

${htmlText}

--EDPUB_BOUNDARY
Content-Type: image/png
Content-ID: <NASALogo>
Content-Transfer-Encoding: base64
Content-Disposition: attachment

${nasaLogo}

--EDPUB_BOUNDARY
Content-Type: image/png
Content-Transfer-Encoding: base64
Content-Disposition: inline ;filename="${imageName}"

${image}

--EDPUB_BOUNDARY--
`;

const wrapBase64String = (data, lineLength = 512) => data.match(new RegExp(`.{1,${lineLength}}`, 'g')).join('\r\n');

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('end', () => resolve(Buffer.concat(chunks)));
  stream.on('error', reject);
});

const getAttachmentAsBase64String = async ({ bucket, key }) => {
  const s3 = new S3Client();

  try {
    const response = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );

    const buffer = await streamToBuffer(response.Body);
    const base64String = buffer.toString('base64');

    return wrapBase64String(base64String);
  } catch (error) {
    console.error(`Failed to fetch S3 object: ${error.message}`);
    throw error;
  }
};

const recipientListToStr = (recipients) => `<${recipients.join('>,<')}>`;

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

async function send(user, eventMessage, bucketInfo, customTemplateFunction, ses) {
  // try {
  //   const bodyArray = await createEmailHtml({
  //     user, eventMessage, customTemplateFunction, logoUrl
  //   });

  //   const payload = {
  //     Source: sourceEmail,
  //     Destination: {
  //       ToAddresses: [user.email]
  //     },
  //     Message: {
  //       Subject: {
  //         Data: 'EDPUB Notification'
  //       },
  //       Body: {
  //         Text: {
  //           Data: bodyArray[0],
  //           Charset: 'UTF-8'
  //         },
  //         Html: {
  //           Data: bodyArray[1],
  //           Charset: 'UTF-8'
  //         }
  //       }
  //     }
  //   };
  //   const command = new SendEmailCommand(payload);
  //   await ses.send(command);
  //   return { success: true };
  // } catch (err) {
  //   console.error(`Error sending email to ${user.email}:`, err);
  //   return ({ error: 'Error sending email ' });
  // }
  const attachmentString = await getAttachmentAsBase64String({
    bucket: bucketInfo.bucket,
    key: bucketInfo.key
  });
  const logoString = await getAttachmentAsBase64String({
    bucket: bucketInfo.bucket,
    key: bucketInfo.key
  });
  const rawString = await getRawFromTemplate({
    subject: 'Testing Raw Email With Attachments',
    from: 'noreply@nasa.gov',
    to: recipientListToStr(['deepak.acharya@uah.edu']),
    htmlText: '<html> <body> <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style> <table border="0" cellpadding="10" cellspacing="0" style="width:100%"> <tr style="width:100%;background:#f8f8f8"> <td> <table> <tr> <td width="60"><img src="cid:NASALogo"></td> <td><h4>Earthdata Pub</h4></td> </tr> </table> </td> <td align="right"><b>Direct Message Received</b></td> <td></td> </tr> <tr> <td colspan="2" style="padding:20px;"> <h1>Testing Header</h1> <p>Testing paragraph</p> </td> </tr> </table> </body> </html>',
    image: attachmentString,
    imageName: 'test.png',
    nasaLogo: logoString
  });
  const command = new SendEmailCommand({
    Content: {
      Raw: {
        Data: new TextEncoder().encode(rawString)
      }
    }
  });
  await ses.send(command);
  return { success: true };
}

async function sendEmail(users, eventMessage, bucketInfo, customTemplateFunction) {
  try {
    const secretsResponse = await getSecretsValues();
    const sesCreds = JSON.parse(secretsResponse.SecretString);
    const ses = new SESv2Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: sesCreds.ses_access_key_id,
        secretAccessKey: sesCreds.ses_secret_access_key
      }
    });

    const promises = users.map(
      (user) => send(user, eventMessage, bucketInfo, customTemplateFunction, ses)
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
