const Schema = require('../src/schema-util.js');
const sample = require('./sample');

describe('Schema', () => {
  describe(' function', () => {
    it('should ', () => {
      expect(Schema).toBeTruthy();
    });
  });
  describe('validate() function', () => {
    it('should return True with valid input', () => {
      const tableName = 'action';
      const actionItem = sample.action;
      expect(Schema.validate(tableName, actionItem)).toBe(true);
    });
  });
  describe('validate() function', () => {
    it('should return False with invalid schema', () => {
      const tableName = 'action';
      const actionItem = sample.invalid_schema;
      expect(Schema.validate(tableName, actionItem)).toBe(false);
    });
  });
  describe('validate() function', () => {
    it('should return False with invalid table name', () => {
      const tableName = 'invalid_name';
      const actionItem = sample.action;
      expect(Schema.validate(tableName, actionItem)).toBe(false);
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
