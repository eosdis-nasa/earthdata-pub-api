const { InvalidOrderByError } = require('./sql-builder.js');
const action = require('./action.js');
const daac = require('./daac.js');
const form = require('./form.js');
const group = require('./group.js');
const question = require('./question.js');
const role = require('./role.js');
const section = require('./section.js');
const service = require('./service.js');
const step = require('./step.js');
const submission = require('./submission.js');
const user = require('./user.js');
const workflow = require('./workflow.js');

describe('per-endpoint sort key allowlists', () => {
  const cases = [
    { name: 'action', fn: action.findAll, sort: 'short_name', sql: 'action.short_name', reject: 'source' },
    { name: 'daac', fn: daac.findAll, sort: 'long_name', sql: 'daac.long_name', reject: 'edpgroup_id_injected' },
    { name: 'form', fn: form.findAll, sort: 'created_at', sql: 'form.created_at', reject: 'sections' },
    { name: 'group', fn: group.findAll, sort: 'short_name', sql: 'edpgroup.short_name', reject: 'parent' },
    { name: 'question', fn: question.findAll, sort: 'question_name', sql: 'question.long_name', reject: 'daac_ids' },
    { name: 'role', fn: role.findAll, sort: 'long_name', sql: 'edprole.long_name', reject: 'permissions' },
    { name: 'section', fn: section.findAll, sort: 'list_order', sql: 'section.list_order', reject: 'questions' },
    { name: 'service', fn: service.findAll, sort: 'endpoint', sql: 'service.endpoint', reject: 'headers' },
    { name: 'step', fn: step.findAll, sort: 'step_name', sql: 'step.step_name', reject: 'data' },
    { name: 'workflow', fn: workflow.findAll, sort: 'version', sql: 'workflow.version', reject: 'steps' }
  ];

  cases.forEach(({ name, fn, sort, sql, reject }) => {
    it(`${name} maps ${sort} to ${sql}`, () => {
      const query = fn({ sort, order: 'asc' });
      expect(query).toMatch(new RegExp(`ORDER BY ${sql.replace('.', '\\.')} ASC`));
    });

    it(`${name} rejects ${reject}`, () => {
      expect(() => fn({ sort: reject, order: 'asc' })).toThrow(InvalidOrderByError);
    });
  });

  it('user findAll maps name onto filtered_users and rejects refresh_token and roles', () => {
    const query = user.findAll({ sort: 'name', order: 'desc' });
    expect(query).toMatch(/ORDER BY filtered_users\.name DESC/);
    expect(user.findAll({ sort: 'email', order: 'asc' })).toMatch(/ORDER BY filtered_users\.email ASC/);
    expect(user.findAll({ sort: 'registered', order: 'desc' })).toMatch(/ORDER BY filtered_users\.registered DESC/);
    expect(user.findAll({ sort: 'last_login', order: 'desc' })).toMatch(/ORDER BY filtered_users\.last_login DESC/);
    expect(() => user.findAll({ sort: 'refresh_token' })).toThrow(InvalidOrderByError);
    expect(() => user.findAll({ sort: 'roles' })).toThrow(InvalidOrderByError);
    expect(() => user.findAll({ sort: 'groups' })).toThrow(InvalidOrderByError);
    expect(() => user.findAll({ sort: 'enabled' })).toThrow(InvalidOrderByError);
    expect(() => user.findAll({
      sort: '(CASE WHEN (substring((SELECT refresh_token FROM edpuser LIMIT 1),1,1)=\'a\') THEN id ELSE 1/0 END)'
    })).toThrow(InvalidOrderByError);
  });

  it('submission maps dashboard aliases and keeps DESC on the last column', () => {
    const query = submission.findAll({
      sort: 'status, created_at',
      order: 'DESC'
    });
    expect(query).toMatch(/ORDER BY step\.status, submission\.created_at DESC/);
    expect(() => submission.findAll({ sort: 'next_action' })).toThrow(InvalidOrderByError);
    expect(() => submission.findAll({ sort: 'data_producer_info_name', order: 'asc' }))
      .not.toThrow();
    expect(submission.findAll({ sort: 'data_producer_info_name', order: 'asc' }))
      .toMatch(/ORDER BY submission\.data_producer_name ASC/);
    expect(submission.findAll({ sort: 'status_message', order: 'desc' }))
      .toMatch(/ORDER BY step\.status DESC/);
    expect(submission.findAll({ sort: 'name', order: 'asc' }))
      .toMatch(/ORDER BY submission\.name ASC/);
    expect(submission.findAll({ sort: 'last_change', order: 'desc' }))
      .toMatch(/ORDER BY submission_status\.last_change DESC/);
    expect(() => submission.findAll({ sort: '(SELECT 1 FROM pg_sleep(5))' }))
      .toThrow(InvalidOrderByError);
  });

  it('daac defaults to short_name ASC using the owned column', () => {
    expect(daac.findAll({})).toMatch(/ORDER BY daac\.short_name ASC/);
  });
});
