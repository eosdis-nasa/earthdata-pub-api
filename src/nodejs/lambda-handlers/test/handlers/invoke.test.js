const invoke = require('../../invoke.js');
const msg = require('message-util');

jest.mock('message-util', () => ({
  sendEvent: jest.fn(),
}));

describe('Invoke handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an event message', async () => {
    const event = {
      payload: {
        action_id: 'test_action_id',
        submission_id: 'test_submission_id',
        data: 'test_data',
      },
      context: {
        user_id: 'test_user_id',
      },
    };

    const expectedEventMessage = {
      event_type: 'action_request',
      action_id: event.payload.action_id,
      submission_id: event.payload.submission_id,
      data: event.payload.data,
      user_id: event.context.user_id,
    };

    await invoke.handler(event);

    expect(msg.sendEvent).toHaveBeenCalledWith(expectedEventMessage);
  });

  it('should return a success message', async () => {
    const event = {
      payload: {
        action_id: 'test_action_id',
        submission_id: 'test_submission_id',
        data: 'test_data',
      },
      context: {
        user_id: 'test_user_id',
      },
    };

    const response = await invoke.handler(event);

    expect(response).toEqual({ message: 'Action requested' });
  });
});