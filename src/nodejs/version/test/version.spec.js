const Version = require('../src/version.js');

describe('Version', () => {
  describe('handler() function', () => {
    it('should be truthy', async () => {
      expect(Version).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
