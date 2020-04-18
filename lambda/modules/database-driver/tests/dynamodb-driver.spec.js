const Driver = require('../src/index.js').DynamodbDriver;
const Stub = require('./dynamo-client-stub.js');
const ErrorResponse = require('../src/error-response.js');
const Db = require('./db_sample.json');

// Suppress console output for running tests
/* eslint-disable no-global-assign */
console = {
  log: () => {}, info: () => {}, warn: () => {}, error: () => {}
};

describe('Dynamodb Driver', () => {
  describe('getItems() function', () => {
    it('should return a single item for id query', async () => {
      const client = Stub.client();
      const driver = new Driver(client);
      const getItemsByIdSpy = jest.spyOn(driver, 'getItemById');
      const table = 'form';
      const id = 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11';
      let uniqueName;
      let version;
      const response = await driver.getItems(table, id, uniqueName, version);
      expect(getItemsByIdSpy).toBeCalled();
      expect(Array.isArray(response.data)).toBeFalsy();
    });

    it('should return a single item for unique_name and version query', async () => {
      const client = Stub.client();
      const driver = new Driver(client);
      const getItemByNameAndVersionSpy = jest.spyOn(driver, 'getItemByNameAndVersion');
      const table = 'form';
      let id;
      const uniqueName = 'VALID_FORM';
      const version = 1;
      const response = await driver.getItems(table, id, uniqueName, version);
      expect(getItemByNameAndVersionSpy).toBeCalled();
      expect(Array.isArray(response.data)).toBeFalsy();
    });

    it('should return an array for unique_name query', async () => {
      const client = Stub.client();
      const driver = new Driver(client);
      const getItemsByNameSpy = jest.spyOn(driver, 'getItemsByName');
      const table = 'question';
      let id;
      const uniqueName = 'poc_info';
      let version;
      const response = await driver.getItems(table, id, uniqueName, version);
      expect(getItemsByNameSpy).toBeCalled();
      expect(Array.isArray(response.data)).toBeTruthy();
    });

    it('should expand foreign key references on single item queries', async () => {
      const client = Stub.client();
      const driver = new Driver(client);
      const table = 'form';
      const id = 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11';
      let uniqueName;
      let version;
      const expected = Db.form.expanded;
      const response = await driver.getItems(table, id, uniqueName, version);
      expect(response.data).toEqual(expected);
    });

    describe('produces proper error responses', () => {
      it('should return error for invalid f_ref', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        const table = 'form';
        const id = 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff12';
        let uniqueName;
        let version;
        const expected = ErrorResponse.invalidReference;
        const response = await driver.getItems(table, id, uniqueName, version);
        expect(response).toEqual(expected);
      });

      it('should return error for no results', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        const table = 'form';
        const id = 'nothing';
        let uniqueName;
        let version;
        const expected = ErrorResponse.noResults;
        const response = await driver.getItems(table, id, uniqueName, version);
        expect(response).toEqual(expected);
      });

      it('should return error for no change', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        const table = 'question';
        const id = 'b1b11bb1-b1b1-41bb-bbbb-1bb1b1b1bb11';
        const item = {};
        Object.assign(item, Db.question[id]);
        const expected = ErrorResponse.noChange;
        const response = await driver.putItem(table, item);
        expect(response).toEqual(expected);
      });

      it('should return error for table parameter missing', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        let table;
        const id = 'b1b11bb1-b1b1-41bb-bbbb-1bb1b1b1bb11';
        let uniqueName;
        let version;
        const expected = ErrorResponse.tableParameterMissing;
        const response = await driver.getItems(table, id, uniqueName, version);
        expect(response).toEqual(expected);
      });

      it('should return error for no such table', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        const table = 'cheese';
        const id = 'b1b11bb1-b1b1-41bb-bbbb-1bb1b1b1bb11';
        let uniqueName;
        let version;
        const expected = ErrorResponse.noSuchTable;
        const response = await driver.getItems(table, id, uniqueName, version);
        expect(response).toEqual(expected);
      });

      it('should return error for invalid query', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        const table = 'form';
        let id;
        let uniqueName;
        const version = 1;
        const expected = ErrorResponse.invalidQuery;
        const response = await driver.getItems(table, id, uniqueName, version);
        expect(response).toEqual(expected);
      });

      it('should return error for validation failed', async () => {
        const client = Stub.client();
        const driver = new Driver(client);
        const table = 'question';
        const item = { fake: 0 };
        const expected = ErrorResponse.validationFailed;
        const response = await driver.putItem(table, item);
        expect(response).toEqual(expected);
      });
    });
  });
});
