/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const db = require('database-util');

const msg = require('message-util');

const { getTemplate, getEmailTemplate } = require('./notification-consumer/templates.js');

// TODO- Remove disable once send email enabled
// eslint-disable-next-line
async function sendEmailNotification({ note, email_payload }) {
  // TODO - Add additional filter for system user messages
  // logic to add DAAC content
  // TODO - remove eslint disable when finished troubleshooting
  // eslint-disable-next-line
  console.log('email triggered');
  // TODO - remove eslint disable when finished troubleshooting
  // eslint-disable-next-line
  console.log(email_payload);
  const users = await db.note.getEmails({
    conversationId: note.conversation_id,
    senderId: note.sender_edpuser_id
  });
  // console.log('users')
  // const usersPayload = []
  // users.forEach(user => {
  //   usersPayload.push({Destination:{
  //     ToAddresses: [user.email],
  //     ReplacementTemplateData: "{\"name\":\""+user.name+"\"}"
  //   }})
  // })

  // const payload = {
  //   Source: "noreply@nasa.gov",
  //   Template: "Default",
  //   Destinations: usersPayload,
  //   DefaultTemplateData: JSON.stringify(email_payload)
  // }
  // console.log(payload)

  await msg.sendEmail(users, email_payload);
}

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  if (!(eventMessage.data && eventMessage.data.silent)) {
    const message = await getTemplate(eventMessage);
    if (message) {
      const operation = message.conversation_id ? 'reply' : 'sendNote';
      if (!message.user_id) {
        const systemUser = await db.user.findSystemUser();
        message.user_id = systemUser.id;
      }
      if (operation === 'sendNote' && !message.subject) {
        message.subject = 'No Subject';
      }
      // TODO- Remove disable once send email enabled
      // eslint-disable-next-line
      const note = await db.note[operation](message);
      const emailPayload = await getEmailTemplate(eventMessage, message);
      await sendEmailNotification({ note, email_payload: emailPayload });
    }
  }
}

async function handler(event) {
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
