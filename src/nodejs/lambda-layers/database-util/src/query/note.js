const sql = require('./sql-builder.js');

const note_visability_refs = {
  user_names: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'unnested_user_ids.note_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['name', 'edpuser.name'],
              ['id', 'edpuser.id']
            ]
          },
          alias: 'user_names'
        }
      ],
      from: {
        base: sql.select({
          fields: [
            'note_id',
            'unnest(user_ids) AS user_id'
          ],
          from: {
            base: 'note_scope'
          },
          alias: 'unnested_user_ids'
        }),
        joins: [{ 
          type: 'left_join', src: 'edpuser', on: { left: 'unnested_user_ids.user_id', right: 'edpuser.id' }
        }]
      },
      group: 'unnested_user_ids.note_id',
      alias: 'uname_map'
    }),
    on: {left: 'note_scope.note_id', right: 'uname_map.note_id'}
  },
  role_names: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'unnested_role_ids.note_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['name', 'edprole.long_name'],
              ['id', 'edprole.id']
            ]
          },
          alias: 'role_names'
        }
      ],
      from: {
        base: sql.select({
          fields: [
            'note_id',
            'unnest(edprole_ids) AS role_id'
          ],
          from: {
            base: 'note_scope'
          },
          alias: 'unnested_role_ids'
        }),
        joins: [{ 
          type: 'left_join', src: 'edprole', on: { left: 'unnested_role_ids.role_id', right: 'edprole.id' }
        }]
      },
      group: 'unnested_role_ids.note_id',
      alias: 'role_map'
    }),
    on: {left: 'note_scope.note_id', right: 'role_map.note_id'}
  }
}

const refs = {
  conversation_note: {
    type: 'left_join',
    src: 'note',
    on: { left: 'conversation.id', right: 'note.conversation_id' }
  },
  conversation_user: {
    type: 'left_join',
    src: 'conversation_edpuser',
    on: { left: 'conversation.id', right: 'conversation_edpuser.conversation_id' }
  },
  participant_agg: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'conversation_edpuser.conversation_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['id', 'edpuser.id'],
              ['name', 'edpuser.name'],
              ['email', 'edpuser.email']
            ]
          },
          sort: 'edpuser.name',
          order: 'ASC',
          alias: 'participants'
        }
      ],
      from: {
        base: 'conversation_edpuser',
        joins: [{
          type: 'left_join', src: 'edpuser',
          on: { left: 'conversation_edpuser.edpuser_id', right: 'edpuser.id' }
        }]
      },
      group: 'conversation_edpuser.conversation_id',
      alias: 'participant_agg'
    }),
    on: { left: 'participant_agg.conversation_id', right: 'conversation.id' }
  },
  note_step_agg: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'note_visability.conversation_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['id', 'note_visability.id'],
              ['text', 'note_visability.text'],
              ['sent', 'note_visability.created_at'],
              ['from', { type: 'json_obj', keys: [['id', 'edpuser.id'], ['name', 'edpuser.name'], ['email', 'edpuser.email']] }],
              ['viewers', { type: 'json_obj', keys: [['users', 'note_visability.user_names'], ['roles', 'note_visability.role_names']]}]
            ]
          },
          sort: 'note_visability.created_at',
          order: 'DESC',
          alias: 'notes'
        }
      ],
      from: {
        base: sql.select({
          fields: [
            'note.*',
            'uname_map.user_names',
            'role_map.role_names'
          ],
          from: {
            base: 'note',
            joins: [
              { type: 'left_join', src: 'note_scope', on: { left: 'note.id', right: 'note_scope.note_id' }},
              note_visability_refs.user_names,
              note_visability_refs.role_names
            ]
          },
          alias: 'note_visability',
          where: { 
            conjunction: 'OR',
            filters: [
              ...([{cmd:'(array_length(note_scope.user_ids, 1) ISNULL AND array_length(note_scope.edprole_ids, 1) ISNULL)'}]),
              ...([{cmd: `{{user_id}}=ANY(note_scope.user_ids)` }]),
              ...([{
                cmd: `note.id IN (${sql.select({
                  fields: ['note.id'],
                  from: {
                    base: 'note',
                    joins: [{
                      type: 'left_join', src: 'note_scope', on: { left: 'note_scope.note_id', right: 'note.id' }
                    }]
                  },
                  where: {
                    conjunction: 'OR',
                    filters: [
                      ...([{cmd:'array_length(note_scope.edprole_ids, 1) ISNULL'}]),
                      ...([{
                        cmd: `note.id IN (${sql.select({
                          fields: ['note_id'],
                          from: {
                            base: sql.select({
                              fields: [
                                'note_scope.note_id',
                                'unnest(note_scope.edprole_ids) as role_id'
                              ],
                              from: {
                                base: 'note_scope'
                              },
                              alias: "unraveled"
                            })
                          },
                          where: {
                            filters: [
                              ...([{
                                cmd: `unraveled.role_id IN (${sql.select({
                                  fields: ['edprole_id'],
                                  from: {
                                    base: 'edpuser_edprole'
                                  },
                                  where: {
                                    filters: [{ field: 'edpuser_id', param: 'user_id' }]
                                  }
                                })})`
                              }])
                            ]
                          }
                        })})`
                      }])
                    ]
                  }
                })})`
              }])
            ]
           }
        }),
        joins: [{
          type: 'left_join', src: 'edpuser', on: { left: 'note_visability.sender_edpuser_id', right: 'edpuser.id' }
        }]
      },
      group: 'note_visability.conversation_id',
      alias: 'note_step_agg',
      where: { filters: [{ field: 'note_visability.step_name', param: 'step_name' }] } 
    }),
    on: { left: 'note_step_agg.conversation_id', right: 'conversation.id' }
  },
  note_agg: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'note_visability.conversation_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['id', 'note_visability.id'],
              ['text', 'note_visability.text'],
              ['sent', 'note_visability.created_at'],
              ['from', { type: 'json_obj', keys: [['id', 'edpuser.id'], ['name', 'edpuser.name'], ['email', 'edpuser.email']] }],
              ['viewers', { type: 'json_obj', keys: [['users', 'note_visability.user_names'], ['roles', 'note_visability.role_names']]}]
            ]
          },
          sort: 'note_visability.created_at',
          order: 'DESC',
          alias: 'notes'
        }
      ],
      from: {
        base: sql.select({
          fields: [
            'note.*',
            'uname_map.user_names',
            'role_map.role_names'
          ],
          from: {
            base: 'note',
            joins: [
              { type: 'left_join', src: 'note_scope', on: { left: 'note.id', right: 'note_scope.note_id' }},
              note_visability_refs.user_names,
              note_visability_refs.role_names
            ]
          },
          alias: 'note_visability',
          where: { 
            conjunction: 'OR',
            filters: [
              ...([{cmd:'(array_length(note_scope.user_ids, 1) ISNULL AND array_length(note_scope.edprole_ids, 1) ISNULL)'}]),
              ...([{cmd: `{{user_id}}=ANY(note_scope.user_ids)` }]),
              ...([{
                cmd: `note.id IN (${sql.select({
                  fields: ['note.id'],
                  from: {
                    base: 'note',
                    joins: [{
                      type: 'left_join', src: 'note_scope', on: { left: 'note_scope.note_id', right: 'note.id' }
                    }]
                  },
                  where: {
                    conjunction: 'OR',
                    filters: [
                      ...([{cmd:'array_length(note_scope.edprole_ids, 1) ISNULL'}]),
                      ...([{
                        cmd: `note.id IN (${sql.select({
                          fields: ['note_id'],
                          from: {
                            base: sql.select({
                              fields: [
                                'note_scope.note_id',
                                'unnest(note_scope.edprole_ids) as role_id'
                              ],
                              from: {
                                base: 'note_scope'
                              },
                              alias: "unraveled"
                            })
                          },
                          where: {
                            filters: [
                              ...([{
                                cmd: `unraveled.role_id IN (${sql.select({
                                  fields: ['edprole_id'],
                                  from: {
                                    base: 'edpuser_edprole'
                                  },
                                  where: {
                                    filters: [{ field: 'edpuser_id', param: 'user_id' }]
                                  }
                                })})`
                              }])
                            ]
                          }
                        })})`
                      }])
                    ]
                  }
                })})`
              }])
            ]
           }
        }),
        joins: [{
          type: 'left_join', src: 'edpuser', on: { left: 'note_visability.sender_edpuser_id', right: 'edpuser.id' }
        }]
      },
      group: 'note_visability.conversation_id',
      alias: 'note_agg'
    }),
    on: { left: 'note_agg.conversation_id', right: 'conversation.id' }
  },
  note_step_agg_admin: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'note_visability.conversation_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['id', 'note_visability.id'],
              ['text', 'note_visability.text'],
              ['sent', 'note_visability.created_at'],
              ['from', { type: 'json_obj', keys: [['id', 'edpuser.id'], ['name', 'edpuser.name'], ['email', 'edpuser.email']] }],
              ['viewers', { type: 'json_obj', keys: [['users', 'note_visability.user_names'], ['roles', 'note_visability.role_names']]}]
            ]
          },
          sort: 'note_visability.created_at',
          order: 'DESC',
          alias: 'notes'
        }
      ],
      from: {
        base: sql.select({
          fields: [
            'note.*',
            'uname_map.user_names',
            'role_map.role_names'
          ],
          from: {
            base: 'note',
            joins: [
              { type: 'left_join', src: 'note_scope', on: { left: 'note.id', right: 'note_scope.note_id' }},
              note_visability_refs.user_names,
              note_visability_refs.role_names
            ]
          },
          alias: 'note_visability'
        }),
        joins: [{
          type: 'left_join', src: 'edpuser', on: { left: 'note_visability.sender_edpuser_id', right: 'edpuser.id' }
        }]
      },
      group: 'note_visability.conversation_id',
      alias: 'note_step_agg',
      where: { filters: [{ field: 'note_visability.step_name', param: 'step_name' }] } 
    }),
    on: { left: 'note_step_agg.conversation_id', right: 'conversation.id' }
  },
  note_agg_admin: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'note_visability.conversation_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['id', 'note_visability.id'],
              ['text', 'note_visability.text'],
              ['sent', 'note_visability.created_at'],
              ['from', { type: 'json_obj', keys: [['id', 'edpuser.id'], ['name', 'edpuser.name'], ['email', 'edpuser.email']] }],
              ['viewers', { type: 'json_obj', keys: [['users', 'note_visability.user_names'], ['roles', 'note_visability.role_names']]}]
            ]
          },
          sort: 'note_visability.created_at',
          order: 'DESC',
          alias: 'notes'
        }
      ],
      from: {
        base: sql.select({
          fields: [
            'note.*',
            'uname_map.user_names',
            'role_map.role_names'
          ],
          from: {
            base: 'note',
            joins: [
              { type: 'left_join', src: 'note_scope', on: { left: 'note.id', right: 'note_scope.note_id' }},
              note_visability_refs.user_names,
              note_visability_refs.role_names
            ]
          },
          alias: 'note_visability'
        }),
        joins: [{
          type: 'left_join', src: 'edpuser', on: { left: 'note_visability.sender_edpuser_id', right: 'edpuser.id' }
        }]
      },
      group: 'note_visability.conversation_id',
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
    filters: [{ field: 'note.id', param: 'id' }]
  }
});

const getConversationList = (params) => sql.select({
  fields: ['conversation.*', 'conversation_edpuser.unread'],
  from: { base: 'conversation', joins: [refs.conversation_user] },
  where: {
    filters: [{ field: 'conversation_edpuser.edpuser_id', param: 'user_id' }]
  },
  sort: 'last_change',
  order: 'DESC'
});

const getPrivilegedConversationList = (params) => `
SELECT * FROM (${getConversationList(params)}) userConversationList
UNION
SELECT *, FALSE as unread FROM (${sql.select({
  fields: ['conversation.*'],
  from: { base: 'conversation' },
  where: {
    filters: [
    ...([{
      field: 'id',
      op: 'ne',
      all: {
        values: {
          type: 'select',
          fields: ['conversation.id'],
          from : { base: 'conversation', joins: [refs.conversation_user] },
          where: {
            filters: [{ field: 'conversation_edpuser.edpuser_id', param: 'user_id' }]
          }
        }
      }
    }]),
    ...(params.daac ? [{
      field: 'id',
      any: {
      values: {
        type: 'select',
        fields: ['submission.conversation_id'],
        from : {
        base: 'submission'
        },
        where: {
        filters: [
        ...([{
          field: 'submission.daac_id',
          any: {
          values: {
            type: 'select',
            fields: ['daac.id'],
            from: {
            base: 'daac',
            joins: [{
            type: 'left_join',
            src: 'edpuser_edpgroup',
            on: { left: 'daac.edpgroup_id', right: 'edpuser_edpgroup.edpgroup_id' }
            }]
            },
            where: {
            filters: [{ field: 'edpuser_edpgroup.edpuser_id', param: 'user_id' }]
            }
          }
          }
        }])
        ]
        }
      }
      }}] : [])
    ]
  },
  sort: 'last_change',
  order: 'DESC'
})}) privilegedConversationList ORDER BY last_change DESC`;

const readConversation = (params) => `
${params.user_id && !params.daac ?
`WITH user_update AS (UPDATE conversation_edpuser SET
 unread = FALSE
 WHERE conversation_edpuser.conversation_id = {{conversation_id}}
 AND conversation_edpuser.edpuser_id = {{user_id}})` : ''}
 ${sql.select({
    fields: ['*'],
    from: {
        base: `(${sql.select({
          fields: ['conversation.id', 'conversation.subject', 'participants', 'edpuser_id', 'created_at', {
            type: 'coalesce',
            src: 'notes',
            fallback: '\'[]\'::JSONB',
            alias: 'notes'
          }],
          from: {
            base: 'conversation',
            joins: [
              refs.conversation_user, 
              refs.participant_agg, 
              ...(params.step_name ? [params.admin ? refs.note_step_agg_admin : refs.note_step_agg] : [params.admin ? refs.note_agg_admin : refs.note_agg])
            ]
          },
          where: {
            filters: [
              { field: 'conversation.id', param: 'conversation_id' }
            ]
          }
        })}) new_query`
        },
    where: {
        conjunction: 'OR',
        filters: [
          ...(params.user_id ? [{field: 'edpuser_id', param: 'user_id'}] : []),
          ...(params.daac ? [{
            field: 'id',
            any: {
            values: {
              type: 'select',
              fields: ['submission.conversation_id'],
              from : {
                base: 'submission'
              },
              where: {
                filters: [
                ...([{
                  field: 'submission.daac_id',
                  any: {
                  values: {
                    type: 'select',
                    fields: ['daac.id'],
                    from: {
                    base: 'daac',
                    joins: [{
                    type: 'left_join',
                    src: 'edpuser_edpgroup',
                    on: { left: 'daac.edpgroup_id', right: 'edpuser_edpgroup.edpgroup_id' }
                    }]
                    },
                    where: {
                    filters: [{ field: 'edpuser_edpgroup.edpuser_id', param: 'user_id' }]
                    }
                  }
                  }
                }])
                ]
              }
            }
            }
          }] : [])
        ]
    },
    sort: 'created_at',
    order: 'DESC'
})}
`;

const reply = (params) => `
WITH new_note AS (INSERT INTO note(conversation_id, sender_edpuser_id, text${params.step_name?`, step_name`:''}) VALUES
 ({{conversation_id}}, {{user_id}}, {{text}}${params.step_name?`, {{step_name}}`:''})
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

const addUsersToConversation = (params) => `
INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
SELECT {{conversation_id}} conversation_id, edpuser.id sender_edpuser_id
FROM edpuser
WHERE edpuser.id = ANY({{user_list}}::UUID[]) ON CONFLICT DO NOTHING
RETURNING *`;
const addUserToConversation = (params) => `
INSERT INTO conversation_edpuser(conversation_id, edpuser_id)
VALUES ({{conversation_id}}, {{user_id}})
ON CONFLICT DO NOTHING
RETURNING *`;

const removeUserFromConversation = () =>`
DELETE FROM conversation_edpuser
WHERE conversation_id = {{conversation_id}} AND edpuser_id = {{user_id}}
`;

const getEmails = (params) => sql.select({
  fields: ['email', 'name'],
  from: {
    base: 'edpuser',
    joins: [{
      type: 'inner_join', src: 'conversation_edpuser',
      on: {
        left: 'edpuser.id',
        right: 'conversation_edpuser.edpuser_id'
      }
    },
    {
      type: 'inner_join', src: 'edpuser_edprole',
      on:{
        left: 'edpuser.id',
        right: 'edpuser_edprole.edpuser_id'
      }
    }
  ]
   },
  where: {
    filters: [
      ...([{field: 'conversation_edpuser.conversation_id', param: 'conversationId'}]),
      ...(params.senderId ? [{field: 'conversation_edpuser.edpuser_id', op: 'ne', param: 'senderId'}] : []),
      ...(params.userRole ? [{field: 'edpuser_edprole.edprole_id', any: {values: {param: 'userRole'}}}] : [])
    ]
  },
  group: 'edpuser.email, edpuser.name'
});

const addViewers = ({ noteId, viewerIds }) => `
WITH uids as (
  SELECT DISTINCT user_ids
  FROM(
    SELECT unnest(user_ids) as user_ids
    FROM note_scope
    WHERE note_id = '${noteId}'
    UNION SELECT unnest(ARRAY['${viewerIds.join('\',\'')}']::UUID[])
  )
)
INSERT INTO note_scope(note_id, user_ids)
VALUES('${noteId}', ARRAY(SELECT user_ids FROM uids))
ON CONFLICT(note_id) DO UPDATE SET user_ids = EXCLUDED.user_ids
RETURNING *`;

const removeViewer = ({ noteId, viewerId }) =>`
UPDATE note_scope
SET user_ids = array_remove(user_ids, '${viewerId}')
WHERE note_id  = '${noteId}'
RETURNING *`;

const addViewerRoles = ({ noteId, viewerRoles }) => `
WITH role_ids as (
  SELECT DISTINCT edprole_ids
  FROM(
    SELECT unnest(edprole_ids) as edprole_ids
    FROM note_scope
    WHERE note_id = '${noteId}'
    UNION SELECT unnest(ARRAY['${viewerRoles.join('\',\'')}']::UUID[])
  )
)
INSERT INTO note_scope(note_id, edprole_ids)
VALUES('${noteId}', ARRAY(SELECT edprole_ids FROM role_ids))
ON CONFLICT(note_id) DO UPDATE SET edprole_ids = EXCLUDED.edprole_ids
RETURNING *`;

const removeViewerRole = ({ noteId, viewerRole }) =>`
UPDATE note_scope
SET edprole_ids = array_remove(edprole_ids, '${viewerRole}')
WHERE note_id  = '${noteId}'
RETURNING *`;


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.getConversationList = getConversationList;
module.exports.getPrivilegedConversationList = getPrivilegedConversationList;
module.exports.readConversation = readConversation;
module.exports.reply = reply;
module.exports.sendNote = sendNote;
module.exports.addUsersToConversation = addUsersToConversation;
module.exports.addUserToConversation = addUserToConversation;
module.exports.getEmails = getEmails;
module.exports.removeUserFromConversation = removeUserFromConversation;
module.exports.addViewers = addViewers;
module.exports.removeViewer = removeViewer;
module.exports.addViewerRoles = addViewerRoles;
module.exports.removeViewerRole = removeViewerRole;