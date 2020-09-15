const Service = require('../src/service.js');

describe('Service', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Service).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
