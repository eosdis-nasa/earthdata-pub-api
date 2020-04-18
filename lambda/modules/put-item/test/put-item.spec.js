const PutItem = require('../src/put-item.js');


// Get reference to driver
const driver = PutItem.getDriver();

const event = {
  pathParameters: { tableName: 'table' },
  body: '{ "test": 0 }'
};

const context = {
  identity: 'identity'
};

describe('Put Item', () => {
  describe('handler() function', () => {
    it('should parse path and body', async () => {
      const putItemSpy = jest.spyOn(driver, 'putItem').mockReturnValue({
        data: true,
        statusCode: 200,
        err: undefined
      });
      await PutItem.handler(event, context);
      expect(putItemSpy).toHaveBeenCalledWith('table', { test: 0 });
    });

    describe('should transform putItem() output to expected format', () => {
      it('omit err when succesful', async () => {
        driver.putItem = jest.fn().mockReturnValue({
          data: true,
          statusCode: 200,
          err: undefined
        });
        const expected = { statusCode: 200, body: JSON.stringify({ data: true }) };
        const response = await PutItem.handler(event, context);
        expect(response).toEqual(expected);
      });

      it('include err when thrown', async () => {
        driver.putItem = jest.fn().mockReturnValue({
          data: false,
          statusCode: 500,
          err: 'error_message'
        });
        const expected = { statusCode: 500, body: JSON.stringify({ data: false, err: 'error_message' }) };
        const response = await PutItem.handler(event, context);
        expect(response).toEqual(expected);
      });
    });
  });
});

jest.mock('database-driver', () => ({
  DynamodbDriver: jest.fn().mockImplementation(() => ({
    putItem: () => {}
  }))
}));


// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
