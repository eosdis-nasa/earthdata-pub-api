const db = require('database-util');
const msg = require('message-util');
const { handler } = require('../../inbound-consumer.js');

db.books = jest.fn();
db.books.create = jest.fn();

msg.parseRecord = jest.fn();

describe('InboundConsumer', () => {
  it('should process inbound messages', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            resource: 'books',
            operation: 'create',
            params: {
              title: 'The Great Gatsby',
              author: 'F. Scott Fitzgerald'
            }
          })
        }
      ]
    };

    msg.parseRecord.mockReturnValue({ eventMessage: { resource: 'books', operation: 'create', params: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } } });

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
  });
});
