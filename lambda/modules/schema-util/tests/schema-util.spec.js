const Schema = require('../src/schema-util.js');

describe('Schema', () => {
  describe(' function', () => {
    it('should ', () => {
      expect(Schema).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
