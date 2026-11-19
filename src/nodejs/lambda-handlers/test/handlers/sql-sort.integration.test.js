const db = require('database-util');

const adminId = '1b10a09d-d342-4eee-a9eb-c99acd2dde17';

function isDbError(result) {
  return result && result.statusCode === 503;
}

function isRejectedSort(result) {
  return result && result.statusCode === 400 && /Invalid (sort|order) parameter/.test(result.error);
}

const injectionPayloads = [
  '(CASE WHEN (substring((SELECT refresh_token FROM edpuser LIMIT 1),1,1)=\'a\') THEN id ELSE 1/0 END)',
  '(SELECT 1 FROM pg_sleep(5))',
  'id; DROP TABLE edpuser; --',
  'random()',
  'lower(name)',
  'CASE WHEN 1=1 THEN id ELSE name END'
];

describe('VDP-3037 sort/order integration', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  describe('legitimate sorts still return rows', () => {
    it('users sorted by name asc and desc return the same rows in reverse order', async () => {
      const asc = await db.user.findAll({ sort: 'name', order: 'asc' });
      const desc = await db.user.findAll({ sort: 'name', order: 'desc' });
      expect(isDbError(asc)).toBe(false);
      expect(isDbError(desc)).toBe(false);
      expect(Array.isArray(asc)).toBe(true);
      expect(asc.length).toBeGreaterThan(0);
      expect(desc.map((row) => row.name)).toEqual([...asc.map((row) => row.name)].reverse());
    });

    it('users sorted by email', async () => {
      const result = await db.user.findAll({ sort: 'email', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('groups sorted by short_name', async () => {
      const result = await db.group.findAll({ sort: 'short_name', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('roles sorted by long_name desc', async () => {
      const result = await db.role.findAll({ sort: 'long_name', order: 'desc' });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('forms sorted by created_at desc', async () => {
      const result = await db.form.findAll({
        sort: 'created_at',
        order: 'desc',
        privileged_user: true
      });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('workflows sorted by short_name', async () => {
      const result = await db.workflow.findAll({ sort: 'short_name', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('actions sorted by short_name', async () => {
      const result = await db.action.findAll({ sort: 'short_name', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(Array.isArray(result)).toBe(true);
    });

    it('questions sorted by short_name', async () => {
      const result = await db.question.findAll({ sort: 'short_name', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('sections sorted by list_order', async () => {
      const result = await db.section.findAll({ sort: 'list_order', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('daacs default sort still works', async () => {
      const result = await db.daac.findAll({});
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });

    it('submissions sorted by last_change desc', async () => {
      const result = await db.submission.findAll({
        sort: 'last_change',
        order: 'desc',
        user_id: adminId
      });
      expect(isDbError(result)).toBe(false);
      expect(Array.isArray(result)).toBe(true);
    });

    it('steps sorted by step_name', async () => {
      const result = await db.step.findAll({ sort: 'step_name', order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('injected sort is rejected without executing SQL', () => {
    it.each(injectionPayloads)('user findAll with payload %s returns 400, not 503', async (sort) => {
      const result = await db.user.findAll({ sort, order: 'asc' });
      expect(isDbError(result)).toBe(false);
      expect(isRejectedSort(result)).toBe(true);
    });

    it.each([
      'group',
      'role',
      'form',
      'workflow',
      'question',
      'section',
      'daac',
      'action',
      'step',
      'service',
      'submission'
    ])('%s findAll with CASE/1/0 payload returns 400', async (resource) => {
      const result = await db[resource].findAll({
        sort: injectionPayloads[0],
        order: 'asc',
        privileged_user: true
      });
      expect(isDbError(result)).toBe(false);
      expect(isRejectedSort(result)).toBe(true);
    });

    it('malicious order on a valid sort is rejected and does not drop users', async () => {
      const result = await db.user.findAll({
        sort: 'name',
        order: 'DESC; DROP TABLE edpuser; --'
      });
      expect(isRejectedSort(result)).toBe(true);
      const stillThere = await db.user.findAll({ sort: 'name', order: 'asc' });
      expect(stillThere.length).toBeGreaterThan(0);
    });

    it('rejects trailing-comma sort instead of changing the page order', async () => {
      const result = await db.user.findAll({ sort: 'name,', order: 'asc' });
      expect(isRejectedSort(result)).toBe(true);
    });

    it('rejects sort with inline direction plus a separate order', async () => {
      const result = await db.user.findAll({ sort: 'name DESC', order: 'ASC' });
      expect(isRejectedSort(result)).toBe(true);
    });
  });
});
