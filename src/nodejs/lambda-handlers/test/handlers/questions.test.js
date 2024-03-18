const db = require('database-util');
const questions = require('../../questions.js');

jest.mock('database-util', () => jest.fn());

db.user = jest.fn();
db.user.findById = jest.fn();
db.question = jest.fn();
db.question.findAll = jest.fn();
db.question.findByName = jest.fn();
db.question.findById = jest.fn();
db.question.update = jest.fn();
db.question.add = jest.fn();
db.question.updateInput = jest.fn();
db.question.deleteInput = jest.fn();

describe('questions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should find all questions', async () => {
    const params = {
      operation: 'findAll',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['QUESTION_READ'] });
    db.question.findAll.mockReturnValue({ message: 'Successfully found all questions.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully found all questions.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully found all questions.' });
  });

  it('should find a question by name', async () => {
    const params = {
      operation: 'findByName',
      name: 'test name',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['QUESTION_READ'] });
    db.question.findByName.mockReturnValue({ message: 'Successfully found question.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully found question.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully found question.' });
  });

  it('should find a question by id', async () => {
    const params = {
      operation: 'findById',
      id: 'test id',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['QUESTION_READ'] });
    db.question.findById.mockReturnValue({ message: 'Successfully found question.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully found question.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully found question.' });
  });

  it('should update a question', async () => {
    const params = {
      operation: 'update',
      question: 'test question',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['QUESTION_READ'] });
    db.question.update.mockReturnValue({ message: 'Successfully updated question.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully updated question.' });
    expect(await questions.handler(params)).toEqual({});
  });

  it('should add a question', async () => {
    const params = {
      operation: 'add',
      question: 'test question',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['QUESTION_READ'] });
    db.question.add.mockReturnValue({ message: 'Successfully added question.' });
    expect(await questions.handler(params)).toEqual({ message: 'Successfully added question.' });
    expect(await questions.handler(params)).toEqual({});
  });

  it('should update inputs', async () => {
    const payload = {
      operation: 'updateInputs',
      questionId: 'test id',
      params: {
        inputs: [{ control_id: 'test id' }]
      },
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockReturnValueOnce({ user_privileges: ['ADMIN'] });
    db.user.findById.mockReturnValueOnce({ user_privileges: ['QUESTION_READ'] });
    db.question.updateInput.mockReturnValue({ message: 'Successfully updated input.' });
    db.question.findById.mockReturnValueOnce({
      inputs: [
        { control_id: 'test id' },
        { control_id: 'test id 2' }
      ]
    });
    db.question.findById.mockReturnValue({ message: 'Successfully updated input.' });
    db.question.deleteInput.mockImplementation((params) => { expect(params.toDelete).toEqual(['test id 2']); });
    expect(await questions.handler(payload)).toEqual({ message: 'Successfully updated input.' });
    expect(await questions.handler(payload)).toEqual({});
  });
});
