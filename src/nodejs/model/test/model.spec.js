const Model = require('../src/model.js');

describe('Model', () => {
  describe('handler() function', () => {
    it('should be truthy', async () => {
      expect(Model).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
