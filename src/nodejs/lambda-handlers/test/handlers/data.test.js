const db = require('database-util');
const msg = require('message-util');
const data = require('../../data.js');

jest.mock('database-util', () => jest.fn());
db.question = jest.fn();
db.question.findById = jest.fn();
db.question.findAll = jest.fn();
db.question.update = jest.fn();
db.question.add = jest.fn();
db.question.updateInput = jest.fn();
db.seed = jest.fn();
db.user = jest.fn();
db.user.findById = jest.fn();
db.daac = jest.fn();
msg.sendEvent = jest.fn();

describe('find by id', () => {
  it('should return a single record', async () => {
    const testEvent = {
      operation: 'findById',
      resource: 'question',
      params: { id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc' },
      context: { user_id: '1234' }
    };
    db.user.findById.mockResolvedValue({ user_privileges: ['ADMIN'] });
    db.question.findById.mockImplementation((params) => ({ id: params.id }));
    const response = await data.handler(testEvent);
    expect(response.id).toEqual(testEvent.params.id);
  });
});

describe('find all', () => {
  it('should return a list of records record', async () => {
    const testEvent = {
      operation: 'findAll',
      resource: 'question',
      params: {},
      context: { user_id: '1234' }
    };
    db.user.findById.mockResolvedValue({ user_privileges: ['ADMIN'] });
    db.question.findAll.mockResolvedValue([{ id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc' }]);
    const response = await data.handler(testEvent);
    expect(response).toEqual([{ id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc' }]);
  });
});

describe('seed', () => {
  it('should seed the db', async () => {
    // eslint-disable-next-line
    expect(data.handler({ operation: 'seed' }));
  });
});

describe('update', () => {
  it('should update a record', async () => {
    const testEvent = {
      operation: 'update',
      resource: 'question',
      params: { id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc' }
    };
    db.question.update.mockImplementation((params) => ({ id: params.id }));
    const response = await data.handler(testEvent);
    expect(response.id).toEqual(testEvent.params.id);
  });
});

describe('add', () => {
  it('should add a record', async () => {
    const testEvent = {
      operation: 'add',
      resource: 'question',
      params: { id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc' }
    };
    db.question.add.mockImplementation((params) => ({ id: params.id }));
    const response = await data.handler(testEvent);
    expect(response.id).toEqual(testEvent.params.id);
  });
});

describe('update inputs', () => {
  it('should update inputs', async () => {
    const testEvent = {
      operation: 'updateInputs',
      resource: 'question',
      params: {
        inputs: ['test'],
        questionId: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
      }
    };
    db.question.updateInput.mockResolvedValue({ input: 'test' });
    const response = await data.handler(testEvent);
    expect(response[0].input).toEqual('test');
  });
});
