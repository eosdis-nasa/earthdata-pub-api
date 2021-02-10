const sql = require('./sql-builder.js');
const findAll = () => 'SELECT note.* FROM note';

const findById = () => `${findAll} WHERE note.id = {{note.id}}`;

const findByConversationId = () => `${findAll} WHERE conversation.id = {{conversation.id}}`;

const findByUserId = () => `
SELECT note.*, note_edpuser.note_viewed FROM note WHERE note.id IN (
 SELECT note_edpuser.note_id FROM note_edpuser WHERE note_edpuser.user_id = {{user.id}})
 ORDER BY note.sent DESC`;

const reply = () => `
WITH new_note AS (INSERT INTO note(conversation_id, sender_edpuser_id, text) VALUES
 ({{note.conversation_id}}, {{user.id}}, {{note.text}})
RETURNING *),
note_user AS (INSERT INTO note_edpuser(note_id, edpuser_id)
 SELECT new_note.id note_id, conversation_edpuser.edpuser_id edpuser_id
 FROM new_note
 NATURAL JOIN conversation_edpuser
RETURNING *)
SELECT * FROM new_note`;

const sendNote = () => `
WITH new_conv AS (INSERT INTO conversation(subject) VALUES({{note.subject}}) RETURNING *),
conv_user AS (INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
 SELECT new_conv.id conversation_id, UNNEST({{note.user_list}}::uuid[]) edpuser_id
 FROM new_conv
RETURNING *),
new_note AS (INSERT INTO note(conversation_id, sender_edpuser_id, text)
 SELECT new_conv.id, {{user.id}}, {{note.text}}
 FROM new_conv
RETURNING *),
note_user AS (INSERT INTO note_edpuser(note_id, edpuser_id)
 SELECT new_note.id note_id, UNNEST({{note.user_list}}::uuid[]) edpuser_id
 FROM new_note
 RETURNING *)
SELECT * FROM new_note`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByConversationId = findByConversationId;
module.exports.findByUserId = findByUserId;
module.exports.reply = reply;
module.exports.sendNote = sendNote;
