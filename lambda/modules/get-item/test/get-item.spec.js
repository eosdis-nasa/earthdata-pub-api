const GetItem = require('../src/get-item.js');


// Get reference to driver
const driver = GetItem.getDriver();

const event = {
  pathParameters: { tableName: 'table' },
  queryStringParameters: {
    id: 'id', uniqueName: 'uniqueName', version: '0'
  }
};

const context = {
  identity: 'identity'
};

describe('Get Item', () => {
  describe('handler() function', () => {
    it('should parse path and query and cast appropriately', async () => {
      const getItemsSpy = jest.spyOn(driver, 'getItems').mockReturnValue({
        data: true,
        statusCode: 200,
        err: undefined
      });
      await GetItem.handler(event, context);
      expect(getItemsSpy).toHaveBeenCalledWith('table', 'id', 'uniqueName',
        0, false);
    });

    describe('should transform getItems() output to expected format', () => {
      it('omit err when succesful', async () => {
        driver.getItems = jest.fn().mockReturnValue({
          data: true,
          statusCode: 200,
          err: undefined
        });
        const expected = { statusCode: 200, body: JSON.stringify({ data: true }) };
        const response = await GetItem.handler(event, context);
        expect(response).toEqual(expected);
      });

      it('include err when thrown', async () => {
        driver.getItems = jest.fn().mockReturnValue({
          data: false,
          statusCode: 500,
          err: 'error_message'
        });
        const expected = { statusCode: 500, body: JSON.stringify({ data: false, err: 'error_message' }) };
        const response = await GetItem.handler(event, context);
        expect(response).toEqual(expected);
      });
    });
  });
});

jest.mock('database-driver', () => ({
  DynamodbDriver: jest.fn().mockImplementation(() => ({
    getItems: () => {}
  }))
}));


// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
