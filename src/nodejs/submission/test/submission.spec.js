const Submission = require('../src/submission.js');

describe('Submission', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Submission).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
