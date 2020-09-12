const MetricsHandler = require('../src/metrics-handler.js');

describe('Metrics Handler', () => {
  describe('handler() function', () => {
    it('placeholder test', async () => {
      expect(MetricsHandler).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
