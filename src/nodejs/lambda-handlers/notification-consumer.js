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

async function sendEmailNotification({ note, emailPayload }) {
  // dict of roles for readability
  const roles = {
    data_producer: '804b335c-f191-4d26-9b98-1ec1cb62b97d',
    data_poc: '29ccab4b-65e2-4764-83ec-77375d29af39',
    daac_staff: 'a5b4947a-67d2-434e-9889-59c2fad39676',
    daac_manager: '2aa89c57-85f1-4611-812d-b6760bb6295c',
    daac_observer: '4be6ca4d-6362-478b-8478-487a668314b1',
    admin: '75605ac9-bf65-4dec-8458-93e018dcca97'
  };

  let userRole = null;

  switch (emailPayload.event_type) {
    case 'form_request':
      userRole = [roles.data_producer, roles.data_poc];
      break;
    case 'form_submitted':
      userRole = [roles.daac_staff, roles.daac_manager];
      break;
    case 'review_approved':
      userRole = [roles.data_producer, roles.data_poc];
      break;
    case 'review_rejected':
      userRole = [roles.data_producer, roles.data_poc];
      break;
    case 'metadata_updated':
      userRole = [roles.data_producer, roles.data_poc];
      break;
    case 'direct_message':
      userRole = [roles.data_producer, roles.data_poc, roles.daac_staff, roles.daac_manager, roles.admin, roles.daac_observer];
      break;
    default:
      userRole = [roles.data_producer, roles.data_poc, roles.daac_staff, roles.daac_manager];
      break;
  }
  const users = await db.note.getEmails({
    conversationId: note.conversation_id,
    senderId: note.sender_edpuser_id,
    userRole
  });
  const resp = await msg.sendEmail(users, emailPayload);
  return resp
}

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  console.log('process record eventMessage')
  console.log(eventMessage)
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
      const note = await db.note[operation](message);
      if (/*process.env.AWS_EXECUTION_ENV*/ eventMessage.event_type !== 'form_submitted' && eventMessage.event_type !== 'form_request') {
        const emailPayload = await getEmailTemplate(eventMessage, message);
        console.log('emailPayload');
        console.log(emailPayload);
        console.log(note);
        const resp = await sendEmailNotification({ note, emailPayload });
        return resp;
      }
    }
  }
}

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
