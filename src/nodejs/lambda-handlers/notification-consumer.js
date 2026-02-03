/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */
const {
  S3Client, CopyObjectCommand, DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const db = require('database-util');
const msg = require('message-util');
const { getTemplate, getEmailTemplate } = require('./notification-consumer/templates.js');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function sendEmailNotification({
  note,
  emailPayload,
  usersList,
  additionalContacts
}) {
  const roles = {
    data_producer: '804b335c-f191-4d26-9b98-1ec1cb62b97d',
    daac_staff: 'a5b4947a-67d2-434e-9889-59c2fad39676',
    daac_manager: '2aa89c57-85f1-4611-812d-b6760bb6295c',
    daac_observer: '4be6ca4d-6362-478b-8478-487a668314b1',
    admin: '75605ac9-bf65-4dec-8458-93e018dcca97',
    uwg_member: '19ac227b-e96c-46fa-a378-cf82c461b669'
  };

  let userRole = null;

  switch (emailPayload.event_type) {
    case 'form_request':
      userRole = [roles.data_producer];
      break;
    case 'form_submitted':
      userRole = [];
      break;
    case 'metadata_updated':
      userRole = [roles.data_producer];
      break;
    case 'action_request_no_id':
      userRole = [];
      break;
    case 'daac_assignment':
      userRole = [];
      break;
    case 'review_request':
      userRole = [];
      break;
    case 'direct_message':
      userRole = [
        roles.data_producer,
        roles.daac_staff,
        roles.daac_manager,
        roles.admin,
        roles.daac_observer,
        roles.uwg_member
      ];
      break;
    default:
      userRole = [roles.data_producer, roles.daac_staff, roles.daac_manager];
      break;
  }

  const users = usersList ? await db.user.getEmails({ user_list: usersList })
    : await db.note.getEmails({
      noteId: note.id,
      conversationId: note.conversation_id,
      senderId: note.sender_edpuser_id,
      userRole
    });

  // Optional contacts from forms that do not necessarily have EDPUB accounts
  if (additionalContacts) {
    users.push(...additionalContacts);
  }

  await msg.sendEmail(users, emailPayload);
}

async function moveDraftAttachments({
  conversationId, attachmentNames, userId, noteId
}) {
  const draftPrefix = `drafts/${conversationId}/${userId}`;
  const s3Client = new S3Client({
    region
  });
  const attachments = [];
  await Promise.all(attachmentNames.map(async (attachmentName) => {
    try {
      const copyCommand = new CopyObjectCommand({
        CopySource: `${ingestBucket}/${draftPrefix}/${attachmentName}`,
        Bucket: ingestBucket,
        Key: `attachments/${noteId}/${attachmentName}`
      });
      await s3Client.send(copyCommand);
      attachments.push(attachmentName);
      const deleteCommand = new DeleteObjectCommand({
        Bucket: ingestBucket,
        Key: `${draftPrefix}/${attachmentName}`
      });
      await s3Client.send(deleteCommand);
    } catch (error) {
      // eslint-disable-next-line
      console.log(`Failed to move object: ${attachmentName}\n${error}`);
    }
  }));
  return attachments;
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

      if (!message.user_name) {
        const user = await db.user.findById({ id: message.user_id });
        message.user_name = user.name;
      }

      if (operation === 'sendNote' && !message.subject) {
        message.subject = 'No Subject';
      }
      const note = await db.note[operation](message);
      if (process.env.AWS_EXECUTION_ENV && message.attachments) {
        message.note_id = note.id;
        const attachments = await moveDraftAttachments({
          conversationId: message.conversation_id,
          attachmentNames: message.attachments,
          userId: message.user_id,
          noteId: note.id
        });
        await db.note.addAttachments({ noteId: note.id, attachments });
      }
      if (process.env.AWS_EXECUTION_ENV && eventMessage.event_type !== 'form_request' && eventMessage.event_type !== 'request_initialized') {
        const emailPayload = eventMessage.emailPayloadProvided ? eventMessage
          : await getEmailTemplate(eventMessage, message);
        emailPayload.user_name = message.user_name;
        await sendEmailNotification({
          note,
          emailPayload,
          usersList: eventMessage.userIds,
          additionalContacts: eventMessage.additional_recipients
        });
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
