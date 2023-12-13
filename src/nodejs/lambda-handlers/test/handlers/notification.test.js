const db = require('database-util');
const msg = require('message-util');
const notification = require('../../notification');

jest.mock('database-util', () => jest.fn());
jest.mock('message-util', () => jest.fn());

msg.sendEvent = jest.fn();
db.note = jest.fn();
db.note.addUserToConversation = jest.fn();
db.note.getPrivilegedConversationList = jest.fn();
db.note.getConversationList = jest.fn();
db.note.readConversation = jest.fn();
db.user = jest.fn();
db.user.findById = jest.fn();

describe('notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should send a direct message', async () => {
    const params = {
      operation: 'send',
      subject: 'test subject',
      text: 'test text',
      user_list: ['test user'],
      context: {
        user_id: 'test user'
      }
    };
    msg.sendEvent.mockImplementation(async (functPayload) => {
      expect(functPayload).toEqual({
        event_type: 'direct_message',
        data: {
          subject: 'test subject',
          text: 'test text',
          user_list: ['test user']
        },
        user_id: 'test user'
      });
    });
    expect(await notification.handler(params)).toEqual({ message: 'Successfully sent.' });
  });

  it('should reply to a conversation', async () => {
    const params = {
      operation: 'reply',
      conversation_id: 'test conversation',
      text: 'test text',
      step_name: 'test step',
      context: {
        user_id: 'test user'
      }
    };
    msg.sendEvent.mockImplementation(async (functPayload) => {
      expect(functPayload).toEqual({
        event_type: 'direct_message',
        data: {
          conversation_id: 'test conversation',
          text: 'test text',
          step_name: 'test step'
        },
        user_id: 'test user'
      });
    });
    expect(await notification.handler(params)).toEqual({ message: 'Successfully sent.' });
  });

  it('should add a user to a conversation', async () => {
    const params = {
      operation: 'add_user',
      conversation_id: 'test conversation',
      user_id: 'test user',
      context: {
        user_id: 'test user'
      }
    };
    db.note.addUserToConversation.mockResolvedValue({ message: 'Successfully added user.' });
    expect(await notification.handler(params)).toEqual({ message: 'Successfully added user.' });
  });

  it('should get a list of conversations', async () => {
    const params = {
      operation: 'conversations',
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockResolvedValueOnce({ user_privileges: ['ADMIN', 'REQUEST_DAACREAD'], user_groups: [] });
    db.user.findById.mockResolvedValueOnce({ user_privileges: ['REQUEST_DAACREAD'], user_groups: [] });
    db.user.findById.mockResolvedValueOnce({ user_privileges: [], user_groups: [] });
    db.note.getPrivilegedConversationList.mockImplementationOnce(async (functPayload) => {
      expect(functPayload).toEqual({
        user_id: 'test user'
      });
      return { message: 'Successfully retrieved conversations.' };
    });
    db.note.getPrivilegedConversationList.mockImplementationOnce(async (functPayload) => {
      expect(functPayload).toEqual({
        user_id: 'test user',
        daac: true
      });
      return { message: 'Successfully retrieved conversations.' };
    });
    db.note.getConversationList.mockResolvedValueOnce({ message: 'Successfully retrieved conversations.' });
    await notification.handler(params);
    await notification.handler(params);
    await notification.handler(params);
  });
  it('should load a conversation', async () => {
    const params = {
      operation: 'conversation',
      conversation_id: 'test conversation',
      params: {
        detailed: true,
        step_name: 'test step'
      },
      context: {
        user_id: 'test user'
      }
    };
    db.user.findById.mockResolvedValueOnce({ user_privileges: ['REQUEST_ADMINREAD', 'ADMIN'], user_groups: [] });
    db.user.findById.mockResolvedValueOnce({ user_privileges: ['REQUEST_ADMINREAD'], user_groups: [] });
    db.user.findById.mockResolvedValueOnce({ user_privileges: [], user_groups: [] });
    db.note.readConversation.mockImplementationOnce(async (functPayload) => {
      expect(functPayload).toEqual({
        conversation_id: 'test conversation',
        step_name: 'test step'
      });
      return { message: 'Successfully retrieved conversation.' };
    });
    db.note.readConversation.mockImplementationOnce(async (functPayload) => {
      expect(functPayload).toEqual({
        conversation_id: 'test conversation',
        step_name: 'test step'
      });
      return { message: 'Successfully retrieved conversation.' };
    });
    db.note.readConversation.mockResolvedValueOnce({ message: 'Successfully retrieved conversation.' });
    await notification.handler(params);
    await notification.handler(params);
    await notification.handler(params);
  });
});
