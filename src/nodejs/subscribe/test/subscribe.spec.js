const Subscribe = require('../src/subscribe.js');

describe('Subscribe', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Subscribe).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
