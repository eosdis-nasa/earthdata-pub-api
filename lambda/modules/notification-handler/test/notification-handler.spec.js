const NotificationHandler = require('../src/notification-handler.js');

describe('Notification Handler', () => {
  describe('handler() function', () => {
    it('placeholder test', async () => {
      expect(NotificationHandler).toBeTruthy();
    });
  });
});

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
