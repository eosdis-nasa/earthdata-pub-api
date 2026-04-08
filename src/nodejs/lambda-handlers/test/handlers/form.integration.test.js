const db = require('database-util');
const form = require('../../form.js');

describe('submission integration', () => {
  afterAll(async () => {
    await db.pool.end();
  });
  describe('should find daac_only form by id for users with ADMIN or DAAC READ', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'formFindById',
        context: { user_id: requestorId },
        form_id: '3f77385f-7087-4d22-81c1-5c29b95d3295',
        params: {}
      };
      const response = await form.handler(testEvent);
      expect(response.id).toEqual('3f77385f-7087-4d22-81c1-5c29b95d3295');
    });
  });
  describe('should not find daac_only form by id for users without ADMIN or DAAC READ', () => {
    const testCases = [
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'formFindById',
        context: { user_id: requestorId },
        form_id: '3f77385f-7087-4d22-81c1-5c29b95d3295',
        params: {}
      };
      const response = await form.handler(testEvent);
      expect(response).toEqual({ error: 'No results' });
    });
  });
  describe('should find forms', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17', expected: 5 },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1', expected: 5 },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', expected: 5 },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f', expected: 5 },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f', expected: 4 },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291', expected: 4 }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, expected }) => {
      const testEvent = {
        operation: 'formFindAll',
        context: { user_id: requestorId },
        params: {}
      };
      const response = await form.handler(testEvent);
      expect(response.length).toEqual(expected);
    });
  });
  describe('should edit a section for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'editSection',
        context: { user_id: requestorId },
        params: {
          id: 'b9393787-c708-4038-a518-000a4f308728',
          form_id: '255c1b91-4631-467a-9512-1558dc80231a',
          heading: 'Moved & Assigned Section',
          list_order: 2,
          required_if: [{ field: 'field1', value: true }],
          show_if: [{ field: 'field1', value: true }],
          daac_id: 'ef229725-1cad-485e-a72b-a276d2ca3175'
        }
      };
      const response = await form.handler(testEvent);
      expect(response.form_id).toEqual('255c1b91-4631-467a-9512-1558dc80231a');
      expect(response.heading).toEqual('Moved & Assigned Section');
      expect(response.list_order).toEqual(2);
      expect(response.required_if).toEqual([{ field: 'field1', value: true }]);
      expect(response.show_if).toEqual([{ field: 'field1', value: true }]);
      expect(response.daac_id).toEqual('ef229725-1cad-485e-a72b-a276d2ca3175');
    });
  });
  describe('should give permissions error on editSection for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'editSection',
        context: { user_id: requestorId },
        params: {
        }
      };
      const response = await form.handler(testEvent);
      expect(response).toEqual({ error: 'Not Authorized' });
    });
  });
  describe('should add a section for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'addSection',
        context: { user_id: requestorId },
        params: {
          form_id: '255c1b91-4631-467a-9512-1558dc80231a',
          heading: 'DAAC Section',
          list_order: 1,
          required_if: [{ field: 'field1', value: true }],
          show_if: [{ field: 'field1', value: true }],
          daac_id: 'ef229725-1cad-485e-a72b-a276d2ca3175'
        }
      };
      const response = await form.handler(testEvent);
      expect(response.form_id).toEqual('255c1b91-4631-467a-9512-1558dc80231a');
      expect(response.heading).toEqual('DAAC Section');
      expect(response.list_order).toEqual(1);
      expect(response.required_if).toEqual([{ field: 'field1', value: true }]);
      expect(response.show_if).toEqual([{ field: 'field1', value: true }]);
      expect(response.daac_id).toEqual('ef229725-1cad-485e-a72b-a276d2ca3175');
    });
  });
  describe('should give permissions error on addSection for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'addSection',
        context: { user_id: requestorId },
        params: {
        }
      };
      const response = await form.handler(testEvent);
      expect(response).toEqual({ error: 'Not Authorized' });
    });
  });
  describe('should create a form for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'createForm',
        context: { user_id: requestorId },
        params: {
          short_name: 'creation',
          version: 0,
          long_name: 'Creation Test',
          description: 'Testing Form Creation',
          daac_only: false
        }
      };
      const response = await form.handler(testEvent);
      expect(response.short_name).toEqual('creation');
      expect(response.version).toEqual(0);
      expect(response.long_name).toEqual('Creation Test');
      expect(response.description).toEqual('Testing Form Creation');
      expect(response.daac_only).toEqual(false);
    });
  });
  describe('should give permissions error on createForm for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'createForm',
        context: { user_id: requestorId },
        params: {
        }
      };
      const response = await form.handler(testEvent);
      expect(response).toEqual({ error: 'Not Authorized' });
    });
  });
  describe('should update a form for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'updateForm',
        context: { user_id: requestorId },
        params: {
          short_name: 'test2',
          version: 2,
          long_name: 'Test Update',
          description: 'Updated test form',
          daac_only: true,
          original_shortname: 'test',
          original_version: 1
        }
      };
      const response = await form.handler(testEvent);
      expect(response.id).toEqual('255c1b91-4631-467a-9512-1558dc80231a');
      expect(response.short_name).toEqual('test2');
      expect(response.version).toEqual(2);
      expect(response.long_name).toEqual('Test Update');
      expect(response.description).toEqual('Updated test form');
      expect(response.daac_only).toEqual(true);
    });
  });
  describe('should give permissions error for updateForm for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'updateForm',
        context: { user_id: requestorId },
        params: {
        }
      };
      const response = await form.handler(testEvent);
      expect(response).toEqual({ error: 'Not Authorized' });
    });
  });
});
