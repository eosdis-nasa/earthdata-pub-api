const Subscription = require('../src/subscription.js');

describe('Subscription', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Subscription).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
