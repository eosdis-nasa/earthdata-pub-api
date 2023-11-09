const subscribe = require('../../subscribe');
const db = require('database-util');

jest.mock('database-util', () => jest.fn());
db.subscription = jest.fn();
db.subscription.subscribe = jest.fn()
db.subscription.unsubscribe = jest.fn()

describe('subscribe', () => {
    it('should subscribe a user to all', async () => {
        const testEvent = {
            operation: 'subscribe',
            user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            group_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            action_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            daac_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            form_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            service_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            submission_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            workflow_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        db.subscription.subscribe.mockImplementation((params) => {return params})
        const response = await subscribe.handler(testEvent);
        expect(response).toEqual({
            type: 'workflow',
            user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            group_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            action_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            daac_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            form_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            service_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            submission_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc',
            workflow_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        });
    })
    it('should subscribe a user to none', async () => {
        const testEvent = {
            operation: 'subscribe',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'}
        }
        db.subscription.subscribe.mockImplementation((params) => {return params})
        const response = await subscribe.handler(testEvent);
        expect(response).toEqual({
            user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        });
    })
})