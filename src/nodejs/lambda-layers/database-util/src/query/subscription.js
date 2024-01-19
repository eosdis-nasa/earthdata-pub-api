const sql = require('./sql-builder.js');

const typeMap = {
  group: {
    action: { field: 'action_id', table: 'edpgroup_subscription_action' },
    daac: { field: 'daac_id', table: 'edpgroup_subscription_daac' },
    form: { field: 'form_id', table: 'edpgroup_subscription_form' },
    service: { field: 'service_id', table: 'edpgroup_subscription_service' },
    submission: { field: 'submission_id', table: 'edpgroup_subscription_submission' },
    workflow: { field: 'workflow_id', table: 'edpgroup_subscription_workflow' }
  },
  user: {
    action: { field: 'action_id', table: 'edpuser_subscription_action' },
    form: { field: 'form_id', table: 'edpuser_subscription_form' },
    service: { field: 'service_id', table: 'edpuser_subscription_service' },
    submission: { field: 'submission_id', table: 'edpuser_subscription_submission' },
    workflow: { field: 'workflow_id', table: 'edpuser_subscription_workflow' }
  }
};
const types = (type, group) => typeMap[group ? 'group' : 'user'][type];

const subscribe = ({ type, user_id, group_id }) => (group_id ? groupSubscribe(types(type, true)) : user_id ? userSubscribe(types(type, false)) : null);

const groupSubscribe = ({ field, table }) => `
INSERT INTO ${table} VALUES
({{group_id}}, {{${field}}})
ON CONFLICT (edpgroup_id, ${field}) DO NOTHING
RETURNING *`;

const userSubscribe = ({ field, table }) => `
INSERT INTO ${table} VALUES
({{user_id}}, {{${field}}})
ON CONFLICT (edpuser_id, ${field}) DO NOTHING
RETURNING *`;

const unsubscribe = ({ type, user_id, group_id }) => (group_id ? groupUnsubscribe(types(type)) : user_id ? userUnsubscribe(types(type)) : null);

const groupUnsubscribe = ({ field, table }) => `
DELETE FROM ${table}
WHERE edpgroup_id = {{group_id}}
AND ${field} = {{${field}}}`;

const userUnsubscribe = ({ field, table }) => `
DELETE FROM ${table}
WHERE edpuser_id = {{user_id}}
AND ${field} = {{${field}}}`;

module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
