const Notify = require('../src/notify.js');

describe('Notify', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Notify).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
