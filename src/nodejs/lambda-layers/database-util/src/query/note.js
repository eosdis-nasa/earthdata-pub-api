const sql = require('./sql-builder.js');

const refs = {
  conversation_note: {
    type: 'left_join',
    src: 'note',
    on: { left: 'conversation.id', right: 'note.conversation_id'}
  },
  conversation_user: {
    type: 'left_join',
    src: 'conversation_edpuser',
    on: { left: 'conversation.id', right: 'conversation_edpuser.conversation_id' }
  },
  note_agg: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'note.conversation_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['text', 'note.text'],
              ['sent', 'note.created_at'],
              ['from', { type: 'json_obj', keys: [['id', 'edpuser.id'], ['name', 'edpuser.name'], ['email', 'edpuser.email']]}]
            ]
          },
          order: 'note.created_at',
          sort: 'DESC',
          alias: 'notes'
        }
      ],
      from: { base: 'note', joins: [{
          type: 'left_join', src: 'edpuser', on: { left: 'note.sender_edpuser_id', right: 'edpuser.id' }
        }]},
      group: 'note.conversation_id',
      alias: 'note_agg'
    }),
    on: { left: 'note_agg.conversation_id', right: 'conversation.id' }
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
  fields: ['conversation.*', 'conversation_edpuser.unread'],
  from: { base: 'conversation', joins: [refs.conversation_user]},
  where: {
    filters: [{ field: 'conversation_edpuser.edpuser_id', param: 'user_id'}]
  },
  order: 'conversation.last_change',
  sort: 'DESC'
});

const readConversation = (params) => sql.select({
  fields: ['conversation.id', 'conversation.subject', 'notes'],
  from: { base: 'conversation', joins: [refs.conversation_user, refs.note_agg] },
  where: {
    filters: [
      { field: 'note_agg.conversation_id', param: 'conversation_id' },
      { field: 'conversation_edpuser.edpuser_id', param: 'user_id' }
    ]
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
conv_sender AS (INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
 SELECT new_conv.id conversation_id, {{user_id}} edpuser_id
 FROM new_conv
RETURNING *),
new_note AS (INSERT INTO note(conversation_id, sender_edpuser_id, text)
 SELECT new_conv.id, {{user_id}}, {{text}}
 FROM new_conv
RETURNING *)
SELECT * FROM new_note`;

const getTicketIdByConversationId = (params) => sql.select({
  fields: ['conversation_kayako_ticket.ticket_id'],
  from: { base: 'conversation_kayako_ticket'},
  where: {
    filters: [{ field: 'id' }]
  }
});

const syncConversation = () => `
WITH new_conv AS (INSERT INTO conversation(subject) VALUES({{subject}}) RETURNING *),
conv_user AS (INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
 SELECT new_conv.id conversation_id, UNNEST({{user_list}}::uuid[]) edpuser_id
 FROM new_conv
RETURNING *),
conv_sender AS (INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
 SELECT new_conv.id conversation_id, {{user_id}} edpuser_id
 FROM new_conv
RETURNING *),
SELECT * FROM new_conv`;

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
module.exports.getTicketIdByConversationId = getTicketIdByConversationId;
module.exports.syncConversation = syncConversation;