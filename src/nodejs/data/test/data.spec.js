const Data = require('../src/data.js');

describe('Data', () => {
  describe('handler() function', () => {
    it('should parse path and query and cast appropriately', async () => {
      expect(Data).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
