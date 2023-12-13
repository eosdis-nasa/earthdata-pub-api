const db = require('database-util');
const msg = require('message-util');
const notificationConsumer = require('../../notification-consumer.js');

jest.mock('database-util', () => jest.fn());
db.user = jest.fn();
db.user.findSystemUser = jest.fn();
db.user.sendNote = jest.fn();
db.user.reply = jest.fn();
db.note = jest.fn();
db.note.getEmails = jest.fn();
db.note.reply = jest.fn();
db.workflow = jest.fn();
db.workflow.getLongName = jest.fn();
db.submission = jest.fn();
db.submission.getFormData = jest.fn();
db.submission.getStepName = jest.fn();
db.submission.getCreatorName = jest.fn();

jest.mock('message-util', () => jest.fn());
msg.parseRecord = jest.fn();
msg.sendEmail = jest.fn();

describe('notification-consumer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should process a step notification', async () => {
    const record = {
      Sns: {
        Type: 'Notification',
        Message: JSON.stringify({
          event_type: 'review_approved',
          submission_id: 'f68a54ba-0411-47ad-934b-42fa552b6fe5',
          conversation_id: '599bea29-b444-4cda-9511-cf38175d4085',
          workflow_id: '45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8',
          user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17',
          data: {
            type: 'form',
            form_id: '6c544723-241c-4896-a38c-adbc0a364293',
            rollback: 'data_accession_request_form'
          }
        })
      }
    };
    const payload = { Records: [record] };
    msg.parseRecord.mockImplementation((params) => ({
      eventMessage:
      JSON.parse(params.Sns.Message)
    }));
    db.user.findSystemUser.mockImplementation(async () => ({ id: '1043c36e-3b6b-48c3-b1fa-8277fe65589f' }));
    process.env.AWS_EXECUTION_ENV = 'test';
    db.workflow.getLongName.mockImplementation(async () => ({ long_name: 'test workflow' }));
    db.submission.getFormData.mockImplementation(async () => ({ data: { data_product_name_value: 'test product' } }));
    db.submission.getStepName.mockImplementation(async () => ({ step_name: 'test step' }));
    db.submission.getCreatorName.mockImplementation(async () => ({ name: 'test user' }));
    db.note.reply.mockImplementation(async () => ({ conversation_id: '1043c36e-3b6b-48c3-b1fa-8277fe65589f', sender_edpuser_id: '1043c36e-3b6b-48c3-b1fa-8277fe65589f' }));
    db.note.getEmails.mockImplementation(async () => [{ email: 'test@test.test' }]);
    msg.sendEmail.mockImplementation(async (users, emailPayload) => {
      expect(users).toEqual([{ email: 'test@test.test' }]);
      expect(emailPayload).toEqual({
        name: 'EDPUB User',
        submission_id: 'f68a54ba-0411-47ad-934b-42fa552b6fe5',
        workflow_name: 'test workflow',
        conversation_last_message: 'Request ID f68a54ba-0411-47ad-934b-42fa552b6fe5 has passed review and Workflow progress will resume.',
        event_type: 'review_approved',
        submission_name: 'test product',
        step_name: 'test step'
      });
      return {};
    });
    await notificationConsumer.handler(payload);
  });
});
