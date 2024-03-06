const db = require('database-util');
const msg = require('message-util');
const { handler } = require('../../metrics-consumer');

jest.mock('database-util', () => jest.fn());
db.metrics = jest.fn();
db.metrics.putMetric = jest.fn();
msg.sendMetric = jest.fn();
msg.parseRecord = jest.fn();

describe('MetricsConsumer', () => {
  it('should process a record', async () => {
    const event = {
      Records: [
        {
          eventMessage: 'test'
        }
      ]
    };
    msg.parseRecord.mockResolvedValue({ eventMessage: 'test' });
    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
  });
});
