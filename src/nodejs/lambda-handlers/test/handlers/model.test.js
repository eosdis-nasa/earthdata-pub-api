const schema = require('schema-util');
const model = require('../../model.js');

jest.mock('schema-util', () => jest.fn());
schema.getModel = jest.fn();

describe('model', () => {
  it('should return a model', async () => {
    const testEvent = {
      model: 'question'
    };
    schema.getModel.mockImplementation((params) => ({ name: params }));
    const response = await model.handler(testEvent);
    expect(response.name).toEqual(testEvent.model);
  });
});
