const db = require('database-util');
const msg = require('message-util');
const submission = require('../../submission.js');

jest.mock('database-util', () => jest.fn());
jest.mock('message-util', () => jest.fn());

db.user = jest.fn();
db.user.findById = jest.fn();
db.note = jest.fn();
db.note.addUsersToConversation = jest.fn();
db.note.removeUserFromConversation = jest.fn();
db.submission = jest.fn();
db.submission.initialize = jest.fn();
db.submission.getState = jest.fn();
db.submission.getAdminSubmissions = jest.fn();
db.submission.getDaacSubmissions = jest.fn();
db.submission.getUsersSubmissions = jest.fn();
db.submission.reassignWorkflow = jest.fn();
db.submission.promoteStep = jest.fn();
db.submission.updateMetadata = jest.fn();
db.submission.updateFormData = jest.fn();
db.submission.updateDaac = jest.fn();
db.submission.withdrawSubmission = jest.fn();
db.submission.findById = jest.fn();
db.submission.restoreSubmission = jest.fn();
db.submission.checkWorkflow = jest.fn();
db.submission.setStep = jest.fn();
db.submission.getConversationId = jest.fn();
db.submission.addContributors = jest.fn();
db.submission.removeContributor = jest.fn();
db.submission.copyFormData = jest.fn();
db.submission.copyActionData = jest.fn();
db.submission.setSubmissionCopy = jest.fn();

msg.sendEvent = jest.fn();

describe('submission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should initialize a submission', async () => {
    const payload = {
      operation: 'initialize',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValue({ id: 'test user' });
    db.submission.initialize.mockReturnValue({
      id: 'test submission'
    });
    db.submission.getState.mockReturnValue({
      id: 'test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow'
    });
    expect(await submission.handler(payload)).toEqual({
      id: 'test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow'
    });
  });

  it('should get the active status of a submission', async () => {
    const payload = {
      operation: 'active',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_ADMINREAD'], user_groups: [] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_DAACREAD'], user_groups: [] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_READ'], user_groups: [] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_WRITE'], user_groups: [] });
    db.submission.getAdminSubmissions.mockReturnValue({ msg: 'admin submission' });
    db.submission.getDaacSubmissions.mockReturnValue({ msg: 'daac submission' });
    db.submission.getUsersSubmissions.mockReturnValue({ msg: 'user submission' });
    expect(await submission.handler(payload)).toEqual({ msg: 'admin submission' });
    expect(await submission.handler(payload)).toEqual({ msg: 'daac submission' });
    expect(await submission.handler(payload)).toEqual({ msg: 'user submission' });
    expect(await submission.handler(payload)).toEqual([]);
  });

  it('should get the status of inactive submissions', async () => {
    const payload = {
      operation: 'inactive',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_ADMINREAD'], user_groups: [] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_DAACREAD'], user_groups: [] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_READ'], user_groups: [] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_WRITE'], user_groups: [] });
    db.submission.getAdminSubmissions.mockReturnValue({ msg: 'admin submission' });
    db.submission.getDaacSubmissions.mockReturnValue({ msg: 'daac submission' });
    db.submission.getUsersSubmissions.mockReturnValue({ msg: 'user submission' });
    expect(await submission.handler(payload)).toEqual({ msg: 'admin submission' });
    expect(await submission.handler(payload)).toEqual({ msg: 'daac submission' });
    expect(await submission.handler(payload)).toEqual({ msg: 'user submission' });
    expect(await submission.handler(payload)).toEqual([]);
  });

  it('should call the applyMethod function', async () => {
    const payload = {
      operation: 'apply',
      context: {
        user_id: 'test user'
      },
      id: 'test id',
      workflow_id: 'test workflow'

    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['NONE'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_REASSIGN'] });
    db.submission.getState.mockReturnValueOnce({
      conversation_id: 'test conversation',
      step: { name: 'test step' }
    });
    expect(await submission.handler(payload)).toEqual({ error: 'Not Authorized' });
    expect(await submission.handler(payload)).toEqual({
      conversation_id: 'test conversation',
      step: { name: 'test step' }
    });
  });

  it('should generate metadata', async () => {
    const payload = {
      operation: 'metadata',
      context: {
        user_id: 'test user'
      },
      id: 'test id',
      metadata: { some: 'metadata' }
    };
    db.submission.updateMetadata.mockReturnValue({ msg: 'metadata updated' });
    db.submission.getState.mockReturnValue({ conversation_id: 'test conversation' });
    expect(await submission.handler(payload)).toEqual({ msg: 'metadata updated' });
  });

  it('should submit a form', async () => {
    const payloadNoId = {
      operation: 'submit',
      context: {
        user_id: 'test user'
      },
      form_id: 'test form',
      daac_id: 'test daac',
      data: { some: 'data' }
    };
    const payloadId = { id: 'test id', ...payloadNoId };
    db.user.findById.mockReturnValue({ id: 'test user' });
    db.submission.getState.mockReturnValueOnce({ // with id first pass
      id: 'test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow',
      step: { name: 'test step' },
      daac_id: 'test daac'
    });
    expect(await submission.handler(payloadId)).toEqual({
      id: 'test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow',
      step: { name: 'test step' },
      daac_id: 'test daac'
    });
  });
  it('should process a form review', async () => {
    const payload = {
      operation: 'review',
      context: {
        user_id: 'test user'
      },
      id: 'test id',
      approve: true
    };
    db.user.findById.mockReturnValue({ id: 'test user', user_privileges: ['REQUEST_REVIEW'] });
    db.submission.getState.mockReturnValue({
      conversation_id: 'test conversation',
      workflow_id: 'test workflow',
      step: { data: 'test step', step_message: 'test message' }
    });
    expect(await submission.handler(payload)).toEqual({
      conversation_id: 'test conversation',
      workflow_id: 'test workflow',
      step: { data: 'test step', step_message: 'test message' }
    });
  });

  it('should withdraw a submission', async () => {
    const payload = {
      operation: 'withdraw',
      context: {
        user_id: 'test user'
      },
      id: 'test id'
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_ADMINREAD'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['NO_PRIVILEGES'] });
    db.submission.findById.mockReturnValueOnce({ msg: 'test submission' });
    db.submission.withdrawSubmission.mockReturnValue({ msg: 'submission withdrawn' });
    expect(await submission.handler(payload)).toEqual({ msg: 'submission withdrawn' });
    expect(await submission.handler(payload)).toEqual({ msg: 'test submission' });
  });

  it('should restore a submission', async () => {
    const payload = {
      operation: 'restore',
      context: {
        user_id: 'test user'
      },
      id: 'test id'
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_ADMINREAD'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['NO_PRIVILEGES'] });
    db.submission.findById.mockReturnValueOnce({ msg: 'test submission' });
    db.submission.restoreSubmission.mockReturnValue({ msg: 'submission restored' });
    expect(await submission.handler(payload)).toEqual({ msg: 'submission restored' });
    expect(await submission.handler(payload)).toEqual({ msg: 'test submission' });
  });

  it('should change the step of a submission', async () => {
    const payload = {
      operation: 'changeStep',
      context: {
        user_id: 'test user'
      },
      id: 'test id',
      step_name: 'test step'
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['REQUEST_ADMINREAD'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['NO_PRIVILEGES'] });
    db.submission.setStep.mockReturnValueOnce({ msg: 'step changed' });
    db.submission.findById.mockReturnValueOnce({ msg: 'test submission' });
    db.submission.checkWorkflow.mockReturnValue({ step_name: true });
    expect(await submission.handler(payload)).toEqual({ msg: 'step changed' });
    expect(await submission.handler(payload)).toEqual({ msg: 'test submission' });
  });

  it('should add a user to a submission', async () => {
    const payload = {
      operation: 'addContributors',
      context: {
        user_id: 'test user'
      },
      id: 'test id',
      contributor_ids: ['test contributor']
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['NO_PRIVILEGES'] });
    db.submission.findById.mockReturnValueOnce({ msg: 'test submission' });
    db.submission.addContributors.mockReturnValue({ msg: 'contributor added' });
    db.submission.getConversationId.mockReturnValue({ conversation_id: 'test conversation' });
    expect(await submission.handler(payload)).toEqual({ msg: 'contributor added' });
    expect(await submission.handler(payload)).toEqual({ msg: 'test submission' });
  });

  it('should be able to remove a contributor', async () => {
    const payload = {
      operation: 'removeContributor',
      context: {
        user_id: 'test user'
      },
      id: 'test id',
      contributor_id: 'test contributor'
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['NO_PRIVILEGES'] });
    db.submission.findById.mockReturnValueOnce({ msg: 'test submission' });
    db.submission.removeContributor.mockReturnValue({ msg: 'contributor removed' });
    db.submission.getConversationId.mockReturnValue({ conversation_id: 'test conversation' });
    expect(await submission.handler(payload)).toEqual({ msg: 'contributor removed' });
    expect(await submission.handler(payload)).toEqual({ msg: 'test submission' });
  });

  it('should be able to copy a submission', async () => {
    const payload = {
      operation: 'copySubmission',
      context: {
        user_id: 'test user'
      },
      id: 'origin test id',
      copy_context: 'why copy'
    };
    const copyFilter = ['data_product_name_value', 'things_to_copy'];
    const testFormData = { data_product_name_value: 'test name', things_to_copy: 'test things', things_not_to_copy: 'test things' };
    // first pass mock responses
    db.submission.findById.mockReturnValueOnce({
      form_data: testFormData,
      daac_id: 'test daac'
    });
    db.submission.findById.mockReturnValueOnce({
      msg: 'passed first copy'
    });
    db.submission.copyFormData.mockImplementationOnce(({ id, data, origin_id: originId }) => {
      expect(data).toEqual(JSON.stringify(testFormData));
      expect(id).toEqual('copy test submission');
      expect(originId).toEqual('origin test id');
    });
    // second pass mock responses
    db.submission.findById.mockReturnValueOnce({
      form_data: testFormData,
      daac_id: 'test daac'
    });
    db.submission.findById.mockReturnValueOnce({
      msg: 'passed second copy'
    });
    db.submission.copyFormData.mockImplementationOnce(({ id, data, origin_id: originId }) => {
      expect(data).toEqual(JSON.stringify({ data_product_name_value: 'Copy of Copy of test name', things_to_copy: 'test things' }));
      expect(id).toEqual('copy test submission');
      expect(originId).toEqual('origin test id');
    });
    // universal mock responses
    db.user.findById.mockReturnValue({ id: 'test user' });
    db.submission.initialize.mockReturnValue({
      id: 'copy test submission'
    });
    db.submission.getState.mockReturnValue({
      id: 'copy test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow'
    });
    db.submission.setSubmissionCopy.mockImplementation(({
      id, edpuser_id: edpuserId, origin_id: originId, context
    }) => {
      expect(id).toEqual('copy test submission');
      expect(edpuserId).toEqual('test user');
      expect(originId).toEqual('origin test id');
      expect(context).toEqual('why copy');
    });

    const passNoFilter = submission.handler(payload);
    expect(await passNoFilter).toEqual({ msg: 'passed first copy' });
    const passFilter = submission.handler({ ...payload, copy_filter: copyFilter });
    expect(await passFilter).toEqual({ msg: 'passed second copy' });
  });

  it('should be able to resume a submission', async () => {
    const payload = {
      operation: 'resume',
      context: {
        user_id: 'test user'
      },
      id: 'test id'
    };
    db.submission.getState.mockReturnValue({
      id: 'test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow',
      step: { name: 'test step' }
    });
    expect(await submission.handler(payload)).toEqual({
      id: 'test submission',
      conversation_id: 'test conversation',
      workflow_id: 'test workflow',
      step: { name: 'test step' }
    });
  });
});
