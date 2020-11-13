const Metrics = require('../src/metrics.js');

describe('Metrics', () => {
  describe('handler() function', () => {
    it('should import without error', async () => {
      expect(Metrics).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
