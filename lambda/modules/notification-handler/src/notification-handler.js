/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const { DynamoDB, SNS } = require('aws-sdk');

const { DynamodbDriver } = require('database-driver');

const { MessageDriver } = require('message-driver');

const ClientConfig = require('./client-config.js');

const dbDriver = new DynamodbDriver(
  new DynamoDB(ClientConfig.dynamodb),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

const msgDriver = new MessageDriver({
  snsClient: new SNS(ClientConfig.sns),
  topicArn: process.env.SNS_TOPIC
});

function constructNote(recipient, message) {
  return {
    recipient_id: recipient,
    source_id: message.attributes.invoked_by,
    source_type: message.attributes.invoke_type,
    subject: message.body.subject,
    text: message.body.text,
    timestamp: message.timestamp
  };
}

async function handler(event) {
  const promises = event.Records.map((record) => {
    const message = msgDriver.parseRecord(record);

    // Construct a list of recipients from subscriptions
    // After dummy data is entered user should be retrieved from db
    // dbDriver.getItems('user', body.to.user_id).then([[user]] => {})
    const user = {
      id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
      user_name: 'Brian Ellingson',
      email: 'brian.ellingson@uah.edu'
    };

    const notePromise = dbDriver.putItem('note', constructNote(user.id, message));
    const emailPromise = msgDriver.sendSns({
      subject: 'Earthdata Pub Notification',
      message: `Hello ${user.user_name}, you have received a note in the Earthdata Pub System. **Please note: In the future this will be a link to view the note.`,
      attributes: {
        email: user.email
      }
    });
    return Promise.all([notePromise, emailPromise]);
  });
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
