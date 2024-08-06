const msg = require('message-util');
const db = require('database-util');
const { handler } = require('../../workflow-consumer');

jest.mock('database-util', () => jest.fn());
db.submission = jest.fn();
db.service = jest.fn();
db.metrics = jest.fn();
db.submission.rollback = jest.fn();
db.submission.getState = jest.fn();
db.submission.promoteStep = jest.fn();
db.metrics.setAccessionReversion = jest.fn();
db.metrics.setStepStartTime = jest.fn();
db.metrics.setStepStopTime = jest.fn();
db.metrics.getSubmissions = jest.fn();
db.service.deleteSecret = jest.fn();
msg.sendEvent = jest.fn();
msg.parseRecord = jest.fn();
db.submission.checkCountStepReviewApproved = jest.fn();
db.submission.checkCountStepReviewRejected = jest.fn();

describe('workflow-consumer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call promoteStepMethod', async () => {
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'workflow_promote_step',
            submission_id: 'submission_id',
            conversation_id: 'conversation_id',
            workflow_id: 'workflow_id',
            data: {
              rollback: 'rollback'
            }
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      const respose = {
        id: params.id,
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'action',
          name: 'name',
          data: {
            rollback: 'rollback'
          }
        }
      };
      return Promise.resolve(respose);
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'action_request_no_id',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        data: {
          rollback: 'rollback'
        }
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });
  it('should start a workflow', async () => {
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'workflow_started',
            submission_id: 'submission_id',
            conversation_id: 'conversation_id',
            workflow_id: 'workflow_id',
            data: {
              rollback: 'rollback'
            }
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      return Promise.resolve({
        id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'form',
          name: 'name',
          form_id: 'form_id',
          data: {
            rollback: 'rollback'
          }
        }
      });
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'form_request',
        form_id: 'form_id',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        data: {
          rollback: 'rollback'
        }
      });
      return Promise.resolve('success');
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'workflow_promote_step_direct',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        data: {
          rollback: 'rollback'
        }
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });
  it('It should initialize a request', async () => {
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'request_initialized',
            submission_id: 'submission_id',
            conversation_id: 'conversation_id',
            workflow_id: 'workflow_id',
            data: {
              rollback: 'rollback'
            }
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      return Promise.resolve({
        id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'form',
          name: 'name',
          form_id: 'form_id',
          data: {
            rollback: 'rollback'
          }
        }
      });
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'form_request',
        form_id: 'form_id',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        data: {
          rollback: 'rollback'
        }
      });
      return Promise.resolve('success');
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'workflow_promote_step_direct',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        data: {
          rollback: 'rollback'
        }
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });
  it('should submit a form', async () => {
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'form_submitted',
            submission_id: 'submission_id',
            form_id: 'form_id',
            user_id: 'user_id'
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      return Promise.resolve({
        id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'form',
          name: 'name',
          form_id: 'form_id'
        }
      });
    });
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      return Promise.resolve({
        id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'review',
          name: 'name',
          data: { rollback: 'rollback' }
        }
      });
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'review_request',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        data: { rollback: 'rollback' }
      });
      return Promise.resolve('success');
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'workflow_promote_step_direct',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        user_id: 'user_id'
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });
  it('should approve a review', async () => {
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'review_approved',
            submission_id: 'submission_id',
            conversation_id: 'conversation_id',
            workflow_id: 'workflow_id',
            user_id: 'user_id',
            step_name: 'step_name'
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.checkCountStepReviewApproved.mockImplementationOnce((params) => {
      expect(params).toEqual({ step_name: 'step_name', submission_id: 'submission_id' });
      return Promise.resolve({
        unapproved: 0
      });
    });
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      return Promise.resolve({
        id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'review',
          name: 'name',
          data: { rollback: 'rollback' }
        }
      });
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'review_request',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        data: { rollback: 'rollback' }
      });
      return Promise.resolve('success');
    });
    // numba 2
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'workflow_promote_step_direct',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        user_id: 'user_id'
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });
  it('should reject a review', async () => {
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'review_rejected',
            submission_id: 'submission_id',
            conversation_id: 'conversation_id',
            workflow_id: 'workflow_id',
            data: { rollback: 'rollback' },
            step_name: 'step_name',
            user_id: 'user_id'
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.rollback.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id', rollback: 'rollback' });
      return Promise.resolve('success');
    });
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      return Promise.resolve({
        id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'service',
          service_id: 'service_id',
          name: 'name',
          data: { rollback: 'rollback' }
        }
      });
    });
    db.submission.checkCountStepReviewRejected.mockImplementationOnce((params) => {
      expect(params).toEqual({ step_name: 'step_name', submission_id: 'submission_id', user_id: 'user_id' });
      return Promise.resolve({
        unapproved: 0
      });
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'service_call',
        service_id: 'service_id',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'name',
        data: { rollback: 'rollback' }
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });

  it('should close a submission', async () => {
    db.metrics.getSubmissions.mockImplementationOnce(
      () => Promise.resolve([{ time_to_publish: 38 }])
    );
    const event = {
      Records: [
        {
          eventMessage: {
            event_type: 'workflow_promote_step',
            submission_id: 'submission_id',
            conversation_id: 'conversation_id',
            workflow_id: 'workflow_id',
            data: {
              rollback: 'rollback'
            }
          }
        }
      ]
    };
    msg.parseRecord.mockImplementation((record) => record);
    db.submission.getState.mockImplementationOnce((params) => {
      expect(params).toEqual({ id: 'submission_id' });
      const respose = {
        id: params.id,
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step: {
          type: 'close',
          name: 'close',
          data: {
            rollback: 'rollback'
          }
        }
      };
      return Promise.resolve(respose);
    });
    msg.sendEvent.mockImplementationOnce((eventMessage) => {
      expect(eventMessage).toEqual({
        event_type: 'workflow_completed',
        submission_id: 'submission_id',
        conversation_id: 'conversation_id',
        workflow_id: 'workflow_id',
        step_name: 'close',
        data: {
          rollback: 'rollback'
        },
        time_to_publish: 38
      });
      return Promise.resolve('success');
    });
    await handler(event);
  });
});
