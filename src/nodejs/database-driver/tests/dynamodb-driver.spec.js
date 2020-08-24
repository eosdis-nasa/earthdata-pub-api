const { Converter } = require('aws-sdk').DynamoDB;

const Driver = require('../src/index.js').DynamodbDriver;

const ErrorMessage = require('../src/error-message.js');

const IndexKeys = require('../src/index-keys.js');

const Db = require('./sample.js');

const DynamoDB = require('./dynamodb-stub.js');

const driver = new Driver(DynamoDB, Converter.marshall, Converter.unmarshall);

describe('Dynamodb Driver', () => {
  describe('getItems() function', () => {
    const table = 'form';
    const pValue = 'VALID_FORM';
    const sValue = '1';
    const index = 'form_name';
    it('should return items', async () => {
      const [data] = await driver.getItems(table, pValue, sValue, index);
      expect(Array.isArray(data)).toBeTruthy();
    });
    it('should generate params', async () => {
      await driver.getItems(table, pValue, sValue, index);
      expect(DynamoDB.spy.params).toEqual(Db.params.get);
    });
  });
  describe('putItem() function', () => {
    const table = 'form';
    const item = Db.form;
    it('should return a truthy response', async () => {
      const [data] = await driver.putItem(table, item);
      expect(data).toBeTruthy();
    });
    it('should generate params', async () => {
      await driver.putItem(table, item);
      expect(DynamoDB.spy.params).toEqual(Db.params.put);
    });
  });
  describe('deleteItem() function', () => {
    const table = 'form';
    const pValue = 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11';
    const sValue = '1';
    it('should return a truthy response', async () => {
      const [data] = await driver.deleteItem(table, pValue, sValue);
      expect(data).toBeTruthy();
    });
    it('should generate params', async () => {
      await driver.deleteItem(table, pValue, sValue);
      expect(DynamoDB.spy.params).toEqual(Db.params.delete);
    });
  });
  describe('updateItem() function', () => {
    const table = 'form';
    const pValue = 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11';
    const sValue = '1';
    const updates = {
      att_one: 1,
      att_two: 'test_value'
    };
    it('should return a truthy response', async () => {
      const [data] = await driver.updateItem(table, pValue, sValue, updates);
      expect(data).toBeTruthy();
    });
    it('should generate params', async () => {
      await driver.updateItem(table, pValue, sValue, updates);
      expect(DynamoDB.spy.params).toEqual(Db.params.update);
    });
  });
  describe('getKeys() function', () => {
    it('should default to primary when index not specified', () => {
      const keys = driver.getKeys('form');
      expect(keys).toEqual(IndexKeys.form.primary);
    });
    it('should return request keys by table and index', () => {
      const keys = driver.getKeys('form', 'form_name');
      expect(keys).toEqual(IndexKeys.form.form_name);
    });
  });
  describe('isInvalid() function', () => {
    it('should return false for valid params', () => {
      const invalid = driver.isInvalid('form', 'form_name');
      expect(invalid).toBeFalsy();
    });
    it('should return noSuchIndex for invalid index', () => {
      const invalid = driver.isInvalid('form', 'xxxxxxx');
      expect(invalid).toBeTruthy();
      expect(invalid).toEqual(ErrorMessage.noSuchIndex);
    });
    it('should return noSuchTable for invalid table', () => {
      const invalid = driver.isInvalid('xxxxxxx', 'xxxxxxx');
      expect(invalid).toBeTruthy();
      expect(invalid).toEqual(ErrorMessage.noSuchTable);
    });
    it('should return tableParameterMissing when no table specified', () => {
      const invalid = driver.isInvalid();
      expect(invalid).toBeTruthy();
      expect(invalid).toEqual(ErrorMessage.tableParameterMissing);
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
