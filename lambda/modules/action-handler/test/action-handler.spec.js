const ActionHandler = require('../src/action-handler.js');

describe('Action Handler', () => {
  describe('handler() function', () => {
    it('should ', async () => {
      expect(ActionHandler).toBeTruthy();
    });
  });
});

// jest.mock('database-driver', () => ({
//   DynamodbDriver: jest.fn().mockImplementation(() => ({
//     getItems: () => {}
//   }))
// }));
//
// jest.mock('message-driver', () => ({
//   MessageDriver: jest.fn().mockImplementation(() => ({
//     parseRecord: () => {},
//     sendSns: () => {}
//   }))
// }));

// Suppress console output
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
