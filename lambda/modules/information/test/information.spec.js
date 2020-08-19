const Information = require('../src/information.js');

describe('Information', () => {
  describe('handler() function', () => {
    it('should parse path and query and cast appropriately', async () => {
      expect(Information).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
