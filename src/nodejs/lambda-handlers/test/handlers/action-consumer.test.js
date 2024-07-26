const Schema = require('schema-util');
const MessageUtil = require('message-util');
const DatabaseUtil = require('database-util');
const actionConsumer = require('../../action-consumer.js');

jest.mock('schema-util');
jest.mock('message-util');
jest.mock('database-util');

MessageUtil.parseRecord = jest.fn();
DatabaseUtil.execute = jest.fn();
MessageUtil.sendEvent = jest.fn();
Schema.generateId = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
// eslint-disable-next-line
  const fs = require('fs');
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockImplementation(() => {
        // Create a stream from a file
        const stream = fs.createReadStream('./src/nodejs/lambda-handlers/test/utils/action.js');
        return Promise.resolve({
          Body: stream
        });
      })
    })),
    GetObjectCommand: jest.fn()
  };
});

describe('action-consumer', () => {
  it('should run an action', async () => {
    const event = {
      Records: [{
        eventMessage: {
          action_id: 'action-id',
          submission_id: 'submission-id',
          data: {}
        }
      }]
    };
    const action = {
      source: 'source'
    };
    const submission = {
      workflow_id: 'workflow-id',
      step_name: 'step-name',
      id: 'submission-id'
    };
    const output = {
      output: 'output'
    };
    const status = {
      id: 'submission-id',
      workflow_id: 'workflow-id',
      step_name: 'step-name'
    };
    const newEventMessage = {
      event_type: 'workflow_promote_step',
      submission_id: 'submission-id',
      workflow_id: 'workflow-id',
      step_name: 'step-name'
    };
    MessageUtil.parseRecord.mockReturnValue({ eventMessage: event.Records[0].eventMessage });
    DatabaseUtil.execute.mockImplementation(({ resource, operation }) => {
      if (resource === 'action' && operation === 'findById') {
        return action;
      }
      if (resource === 'submission' && operation === 'findById') {
        return submission;
      }
      if (resource === 'submission' && operation === 'updateActionData') {
        return output;
      }
      if (resource === 'submission' && operation === 'findById') {
        return status;
      }
      return null;
    });
    Schema.generateId.mockReturnValue('4ccbc002-4ec9-43b3-9bc2-50bfd531d417');
    const result = await actionConsumer.handler(event);
    expect(result).toEqual({ statusCode: 200 });
    expect(MessageUtil.parseRecord).toHaveBeenCalledWith(event.Records[0]);
    expect(DatabaseUtil.execute).toHaveBeenCalledWith({ resource: 'action', operation: 'findById' }, { id: 'action-id' });
    expect(DatabaseUtil.execute).toHaveBeenCalledWith({ resource: 'submission', operation: 'findById' }, { id: 'submission-id' });
    expect(DatabaseUtil.execute).toHaveBeenCalledWith({ resource: 'submission', operation: 'updateActionData' }, { id: 'submission-id', action_id: 'action-id', data: { output: { output: 'output' }, source: 'source' } });
    expect(DatabaseUtil.execute).toHaveBeenCalledWith({ resource: 'submission', operation: 'findById' }, { id: 'submission-id' });
    expect(MessageUtil.sendEvent).toHaveBeenCalledWith(newEventMessage);
    expect(Schema.generateId).toHaveBeenCalled();
  });
});
