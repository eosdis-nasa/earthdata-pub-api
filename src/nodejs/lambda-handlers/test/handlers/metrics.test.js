const msg = require('message-util');
const db = require('database-util');
const { handler } = require('../../metrics');

jest.mock('message-util');
jest.mock('database-util');
msg.sendEvent = jest.fn();
db.metrics = jest.fn();
db.daac = jest.fn();
db.daac.getActiveDaacs = jest.fn();
db.metrics.getSubmissions = jest.fn();
db.metrics.getAverageTimeToPublish = jest.fn();
db.metrics.getUserCount = jest.fn();
db.metrics.metricsStats = jest.fn();

describe('Metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get daacs', async () => {
    const event = {
      operation: 'get_daacs'
    };
    db.daac.getActiveDaacs.mockResolvedValue([
      {
        daac_id: 'daac1',
        name: 'daac1'
      },
      {
        daac_id: 'daac2',
        name: 'daac2'
      }
    ]);
    const result = await handler(event);
    expect(result).toEqual({
      daac_count: 2,
      daacs: [
        {
          daac_id: 'daac1',
          name: 'daac1'
        },
        {
          daac_id: 'daac2',
          name: 'daac2'
        }
      ]
    });
  });
  it('should get submissions', async () => {
    const event = {
      operation: 'get_submissions',
      payload: {
        start_date: '2021-01-01',
        end_date: '2021-01-31',
        daac_id: 'daac1',
        workflow_id: 'workflow1',
        submission_id: 'submission1',
        role_id: 'role1',
        privilege: 'privilege1',
        state: 'state1'
      }
    };
    db.metrics.getSubmissions.mockImplementationOnce(async (args) => {
      expect(args).toEqual({
        start_date: '2021-01-01',
        end_date: '2021-01-31',
        daac_id: 'daac1',
        workflow_id: 'workflow1',
        submission_id: 'submission1',
        state: 'state1'
      });
      return [
        {
          submission_id: 'submission1'
        }
      ];
    });
    const result = await handler(event);
    expect(result).toEqual({
      count: 1,
      submissions: [
        {
          submission_id: 'submission1'
        }
      ]
    });
    const event2 = {
      operation: 'get_submissions',
      payload: {
        metric: 'time_to_publish'
      }
    };
    db.metrics.getAverageTimeToPublish.mockResolvedValue([
      {
        submission_id: 'submission1'
      }
    ]);
    const result2 = await handler(event2);
    expect(result2).toEqual([
      {
        submission_id: 'submission1'
      }
    ]);
    const event3 = {
      operation: 'get_submissions',
      payload: {
        metric: 'user_count',
        daac_id: 'daac1',
        role_id: 'role1',
        privilege: 'privilege1'
      }
    };
    db.metrics.getUserCount.mockImplementationOnce(async (args) => {
      expect(args).toEqual({
        group_id: 'daac1',
        role_id: 'role1',
        privilege: 'privilege1'
      });
      return 10;
    });
    const result3 = await handler(event3);
    expect(result3).toEqual(10);
  });
  it('should use the put method', async () => {
    const event = {
      operation: 'put',
      payload: {
        action_id: 'action1',
        conversation_id: 'conversation1',
        daac_id: 'daac1',
        form_id: 'form1',
        group_id: 'group1',
        question_id: 'question1',
        role_id: 'role1',
        service_id: 'service1',
        submission_id: 'submission1',
        workflow_id: 'workflow1',
        data: 'data1'
      },
      context: { user_id: 'user1' }
    };
    msg.sendEvent.mockImplementationOnce(async (args) => {
      expect(args).toEqual({
        event_type: 'client_event',
        user_id: 'user1',
        action_id: 'action1',
        conversation_id: 'conversation1',
        daac_id: 'daac1',
        form_id: 'form1',
        group_id: 'group1',
        question_id: 'question1',
        role_id: 'role1',
        service_id: 'service1',
        submission_id: 'submission1',
        workflow_id: 'workflow1',
        data: 'data1'
      });
    });
    const result = await handler(event);
    expect(result).toEqual({ message: 'Success!' });
  });
});
