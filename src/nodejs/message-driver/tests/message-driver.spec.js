const SNS = require('./sns-stub.js');

const SQS = require('./sqs-stub.js');

const Msg = require('./sample.js');

const Driver = require('../src/index.js').MessageDriver;

const driver = new Driver({
  snsClient: SNS,
  topicArn: process.env.SNS_TOPIC,
  sqsClient: SQS,
  queueUrl: process.env.SQS_QUEUE
});

describe('Message Driver', () => {
  describe('sendSns() function', () => {
    it('should ', async () => {
      await driver.sendSns(Msg.snsMessage.pre);
      expect(SNS.spy.params).toEqual(Msg.snsMessage.post);
    });
  });
  describe('sendSqs() function', () => {
    it('should ', async () => {
      await driver.sendSqs(Msg.sqsMessage.pre);
      expect(SQS.spy.params).toEqual(Msg.sqsMessage.post);
    });
  });
  describe('parseSendSns() function', () => {
    it('should ', async () => {
      expect(true).toBeTruthy();
    });
  });
  describe('parseSendSqs function', () => {
    it('should ', async () => {
      expect(true).toBeTruthy();
    });
  });
  describe('constructAttributes() function', () => {
    it('should ', async () => {
      const attributes = driver.constructAttributes(Msg.attributes.pre);
      expect(attributes).toEqual(Msg.attributes.post);
    });
  });
});
