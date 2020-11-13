const findAll = 'SELECT note.* FROM note';
const findById = `${findAll} WHERE note.id = {{note.id}}`;
const findByConversationId = `${findAll} WHERE conversation.id = {{conversation.id}}`;
const findByUserId = `SELECT note.*, note_edpuser.note_viewed FROM note WHERE note.id IN (
    SELECT note_edpuser.note_id FROM note_edpuser WHERE note_edpuser.user_id = {{user.id}})
    ORDER BY note.sent DESC`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByConversationId = findByConversationId;
module.exports.findByUserId = findByUserId;
