const parseRecord = require('./record-parser.js');
/**
 * A driver to abstract sending messages to AWS SNS and SQS.
 */
class MessageDriver {
  /**
   * Create a driver to simplify interaction with AWS SNS and SQS.
   * @param {object} opts - Client instances and connection parameters
   * @param {object} opts.snsClient - AWS SNS Client instance
   * @param {string} opts.topicArn - ARN for an AWS SNS Topic to connect
   * @param {object} opts.sqsClient - AWS SQS Client instance
   * @param {string} opts.queueUrl - URL for an AWS SQS Queue to connect
   */
  constructor({
    snsClient, topicArn, sqsClient, queueUrl
  }) {
    this.snsClient = snsClient;
    this.topicArn = topicArn;
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
    this.parseRecord = parseRecord;

    this.operations = {
      ...(this.snsClient
        ? {
          sendSns: this.snsClient.publish.bind(this.snsClient)
        } : {}),
      ...(this.sqsClient
        ? {
          sendSqs: this.sqsClient.sendMessage.bind(this.sqsClient)
        } : {})
    };
  }

  /**
   * Sends a simple format message to SNS
   * @param {object} msg - A message in a simple general format
   * @return {Promise} A promise that resolves when the message is sent
   */
  sendSns(message) {
    if (this.snsClient) {
      const params = this.constructSnsMessage(message);
      return this.request('sendSns', params);
    }
    return undefined;
  }

  /**
   * Sends a simple format message to SQS
   * @param {object} msg - A message in a simple general format
   * @return {Promise} A promise that resolves when the message is sent
   */
  sendSqs(message) {
    if (this.sqsClient) {
      const params = this.constructSqsMessage(message);
      return this.request('sendSqs', params);
    }
    return undefined;
  }

  /**
   * Converts a simple message into required format for SNS
   * @param {object} msg - A message in a simple general format
   * @return {object} Converted SNS message ready to send
   */
  constructSnsMessage(msg) {
    const params = {
      Message: JSON.stringify(msg.body),
      MessageAttributes: this.constructAttributes(msg.attributes),
      TopicArn: this.topicArn,
      ...(msg.subject ? { Subject: msg.subject } : {})
    };
    return params;
  }

  /**
   * Converts a simple message into required format for SQS
   * @param {object} msg - A message in a simple general format
   * @return {object} Converted SQS message ready to send
   */
  constructSqsMessage(msg) {
    const params = {
      MessageBody: JSON.stringify(msg.body),
      MessageAttributes: this.constructAttributes(msg.attributes),
      QueueUrl: this.queueUrl
    };
    return params;
  }

  /**
   * Remap a simple key-value map to required input for a message.
   * @param {object} attributes - Key value map of message attributes
   * @return {object} A map with values denoted by value type
   */
  constructAttributes(attributes) {
    return Object.entries(attributes).reduce((formatted, [key, val]) => {
      formatted[key] = {
        DataType: 'String',
        StringValue: val.toString()
      };
      return formatted;
    }, {});
  }

  request(operation, params) {
    const method = this.operations[operation];
    const promise = new Promise((resolve) => {
      const callback = (err, data) => {
        if (err) {
          console.error(`[ERROR] ${err}`);
          return resolve(err);
        }
        return resolve(data);
      };
      method(params, callback);
    });
    return promise;
  }
}

module.exports = MessageDriver;
