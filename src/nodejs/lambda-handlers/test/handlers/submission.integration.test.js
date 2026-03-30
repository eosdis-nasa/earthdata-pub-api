const db = require('database-util');
const submission = require('../../submission.js');

describe('submission integration', () => {
  afterAll(async () => {
    await db.pool.end();
  });
  describe('should return active submissions based on permissions', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17', expected: 3 },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1', expected: 0 },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', expected: 1 },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f', expected: 3 },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f', expected: 0 },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291', expected: 3 }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, expected }) => {
      const testEvent = {
        operation: 'active',
        context: { user_id: requestorId }
      };

      const response = await submission.handler(testEvent);
      expect(response.length).toEqual(expected);
    });
  });
  describe('should return inactive submissions based on permissions', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17', expected: 2 },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1', expected: 1 },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', expected: 0 },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f', expected: 2 },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f', expected: 0 },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291', expected: 2 }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, expected }) => {
      const testEvent = {
        operation: 'inactive',
        context: { user_id: requestorId }
      };
      const response = await submission.handler(testEvent);
      expect(response.length).toEqual(expected);
    });
  });
  describe('should get submissions by workflow Id for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'getSubmissionCountByWorkflowId',
        context: { user_id: requestorId },
        params: {
          id: '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9'
        }
      };
      const response = await submission.handler(testEvent);
      expect(response).toEqual({ submission_count: '2' });
    });
  });
  describe('should not get submissions by workflow Id for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'getSubmissionCountByWorkflowId',
        context: { user_id: requestorId },
        params: {
          id: '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9'
        }
      };
      const response = await submission.handler(testEvent);
      expect(response).toEqual({ error: 'Not Authorized' });
    });
  });
  describe('should determine whether or not a code is valid', () => {
    const testCases = [
      { descriptor: 'VALID', code: 'dbd5f648-77a0-4379-a5b4-438358881bdc', expected: true },
      { descriptor: 'INVALID', code: 'dbd5f648-77a0-4379-a5b4-438358881bdd', expected: false }
    ];

    it.each(testCases)('property is_valid==$expected when the provided code is $descriptor', async ({ code, expected }) => {
      const testEvent = {
        operation: 'validateCode',
        context: { user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
        code
      };
      const response = await submission.handler(testEvent);
      expect(response.is_valid).toEqual(expected);
    });
  });
  it('should initilize a submission without a code', async () => {
    const testEvent = {
      operation: 'initialize',
      context: { user_id: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    };
    const response = await submission.handler(testEvent);
    expect(response.workflow_id).toEqual('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9');
    expect(response.daac_id).toEqual(null);
    expect(response.conversation_id).toBeTruthy();
  });
  it('should initilize a submission with a valid code', async () => {
    const testEvent = {
      operation: 'initialize',
      context: { user_id: '12afacf8-fae8-4b13-83c3-7d332732a291' },
      code: 'dbd5f648-77a0-4379-a5b4-438358881bdc'
    };
    const response = await submission.handler(testEvent);
    expect(response.workflow_id).toEqual('f223eec5-2c4d-4412-9c97-5df4117c9290');
    expect(response.daac_id).toEqual('cdccdd71-cbe2-4220-8569-a6355ea24f3f');
    expect(response.conversation_id).toBeTruthy();
  });
  it('should not initilize a submission when given an invalid code', async () => {
    const testEvent = {
      operation: 'initialize',
      context: { user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      code: 'dbd5f648-87a0-4379-a5b4-438358881bdc'
    };
    const response = await submission.handler(testEvent);
    expect(response).toEqual({ error: 'Invalid Code' });
  });
  describe('should apply the workflow change to a submission for users with REQUEST_REASSIGN', () => {
    const testCases = [
      {
        descriptor: 'ADMIN',
        requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17',
        submissionId: '18ae776a-12ba-4d73-8799-816e1e143e15',
        workflowId: 'f223eec5-2c4d-4412-9c97-5df4117c9290'
      },
      {
        descriptor: 'DS',
        requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1',
        submissionId: '18ae776a-12ba-4d73-8799-816e1e143e19',
        workflowId: '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9'
      }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, submissionId, workflowId }) => {
      const testEvent = {
        operation: 'apply',
        context: { user_id: requestorId },
        id: submissionId,
        workflow_id: workflowId
      };
      const response = await submission.handler(testEvent);
      expect(response.workflow_id).toEqual(workflowId);
    });
  });
  describe('should not apply workflow change for users without REQUEST_REASSIGN', () => {
    const testCases = [
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'apply',
        context: { user_id: requestorId },
        id: '18ae776a-12ba-4d73-8799-816e1e143e15',
        workflow_id: 'f223eec5-2c4d-4412-9c97-5df4117c9290'
      };
      const response = await submission.handler(testEvent);
      expect(response).toEqual({ error: 'Not Authorized' });
    });
  });
});
