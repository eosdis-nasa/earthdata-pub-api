const Invoke = require('../src/invoke.js');

describe('Invoke', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Invoke).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
