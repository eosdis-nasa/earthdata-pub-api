const Register = require('../src/register.js');

describe('Register', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Register).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
