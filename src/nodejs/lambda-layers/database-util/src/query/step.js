const sql = require('./sql-builder.js');

const findAll = ({ order, sort, per_page, page }) => sql.select({
    fields: ['*'],
    from: {
      base: 'step'
    },
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {}),
    ...(per_page ? { limit: per_page } : {}),
    ...(page ? { offset: page } : {})
  });
  
const findById = () => sql.select({
    field: fields(allFields),
    from: {
        base: 'step',
    },
    where: {
        filters: [{ field: 'step_id' }]
    }
});

const create = (params) => sql.insert({
    ...{
      table: `step (${params.step_id ? 'step_id,': ''} step_name, type, action_id, form_id, service_id, step_status_label, data)`,
      values: {
        type: 'values_list',
        items: [
          ...(params.step_id ? ['{{step_id}}'] : []),
          '{{step_name}}', '{{type}}',
          params.action_id? '{{action_id}}':'null',
          params.form_id? '{{form_id}}':'null',
          params.service_id? '{{service_id}}':'null',
          params.step_status_label? '{{step_status_label}}':'null',
          params.data? '{{data}}':'null',
        ]
      }
    },
    ...(params.step_id ? {conflict:{
      constraints: ['step_id'],
      update:{
        type:'update',
        set:[{cmd:'step_name = EXCLUDED.step_name, type = EXCLUDED.type, action_id = EXCLUDED.action_id, form_id = EXCLUDED.form_id, service_id = EXCLUDED.service_id, step_status_label = EXCLUDED.step_status_label, data = EXCLUDED.data'}]
      }
    }} : {}),
    ...{
      returning: ['*']
    }
  });


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.create = create;

