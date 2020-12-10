const Auth = require('../src/auth.js');

describe('Auth', () => {
  describe('handler() function', () => {
    it('should be truthy', async () => {
      expect(Auth).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
