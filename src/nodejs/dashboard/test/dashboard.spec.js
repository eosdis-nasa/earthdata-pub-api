const Dashboard = require('../src/dashboard.js');

describe('Dashboard', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(Dashboard).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
