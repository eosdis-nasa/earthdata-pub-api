const actionConsumer = require('../action-consumer.js');

describe('processRecord', () => {
    it('should process a record', async ()=>{
        const record = {
            eventMessage: {
                action_id: 1,
                submission_id: 1,
                data: {}
            }
        }
        const result = await actionConsumer.handler(record);
        expect(result).toBeTruthy();
    })
});