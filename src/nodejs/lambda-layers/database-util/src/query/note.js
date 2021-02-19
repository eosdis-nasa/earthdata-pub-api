const sql = require('./sql-builder.js');

const refs = {
  conversation_user: {
    type: 'left_join',
    src: 'conversation_edpuser',
    on: { left: 'conversation.id', right: 'conversation_edpuser.conversation_id' }
  },
  note_kayako: {
    type: 'natural_join',
    src: 'note_kayako_post'
  },
  conversation_kayako: {
    type: 'natural_join',
    src: 'conversation_kayako_ticket'
  }
};

const findAll = (params) => sql.select({
  fields: ['note.*'],
  from: { base: 'note' }
});

const findById = (params) => sql.select({
  fields: ['note.*'],
  from: { base: 'note' },
  where: {
    filters: [{ field: 'note.id' }]
  }
});

const getNoteByPostId = (params) => sql.select({
  fields: ['note.*'],
  from: { base: 'note', joins: [refs.note_kayako] },
  where: {
    filters: [{ field: 'post_id' }]
  }
});

const linkPostId = (params) => sql.insert({
  table: 'note_kayako_post',
  values: {
    type: 'insert_values',
    values: [{ param: 'note_id'}, { param: 'post_id' }]
  }
});

const getConversationByTicketId = (params) => sql.select({
  fields: ['conversation.*'],
  from: { base: 'conversation', joins: [refs.conversation_kayako] },
  where: {
    filters: [{ field: 'ticket_id' }]
  }
});

const linkTicketId = (params) => sql.insert({
  table: 'conversation_kayako_ticket',
  values: {
    type: 'insert_values',
    values: [{ param: 'conversation_id'}, { param: 'ticket_id' }]
  }
});

const getConversationList = (params) => sql.select({
  fields: ['conversation.*'],
  from: { base: 'conversation', joins: [refs.conversation_user]},
  where: {
    filters: [{ field: 'conversation_edpuser.edpuser_id', param: 'user_id'}]
  },
  order: 'conversation.last_change',
  sort: 'DESC'
});

const readConversation = (params) => sql.select({
  fields: ['note.*'],
  from: { base: 'note' },
  where: {
    filters: [{ field: 'conversation_id' }]
  },
  order: 'created_at',
  sort: 'DESC'
})

const reply = () => `
WITH new_note AS (INSERT INTO note(conversation_id, sender_edpuser_id, text) VALUES
 ({{conversation_id}}, {{user_id}}, {{text}})
RETURNING *),
conversation_update AS (UPDATE conversation SET
 last_change = new_note.created_at
 FROM new_note
 WHERE conversation.id = new_note.conversation_id
RETURNING *),
user_update AS (UPDATE conversation_edpuser SET
 unread = TRUE
 FROM new_note
 WHERE conversation_edpuser.conversation_id = new_note.conversation_id
RETURNING *)
SELECT * FROM new_note`;

const sendNote = () => `
WITH new_conv AS (INSERT INTO conversation(subject) VALUES({{subject}}) RETURNING *),
conv_user AS (INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
 SELECT new_conv.id conversation_id, UNNEST({{user_list}}::uuid[]) edpuser_id
 FROM new_conv
RETURNING *),
new_note AS (INSERT INTO note(conversation_id, sender_edpuser_id, text)
 SELECT new_conv.id, {{user_id}}, {{text}}
 FROM new_conv
RETURNING *)
SELECT * FROM new_note`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.getNoteByPostId = getNoteByPostId;
module.exports.linkPostId = linkPostId;
module.exports.getConversationByTicketId = getConversationByTicketId;
module.exports.linkTicketId = linkTicketId;
module.exports.getConversationList = getConversationList;
module.exports.readConversation = readConversation;
module.exports.reply = reply;
module.exports.sendNote = sendNote;
