module.exports.snsMessage = {
  pre: {
    body: { a: 1, b: 2 },
    subject: 'Test Subject',
    attributes: { att_1: 'test', att_2: 1 }
  },
  post: {
    Message: '{"a":1,"b":2}',
    MessageAttributes: {
      att_1: { DataType: 'String', StringValue: 'test' },
      att_2: { DataType: 'String', StringValue: '1' }
    },
    Subject: 'Test Subject',
    TopicArn: 'TEST_TOPIC'
  }
};

module.exports.sqsMessage = {
  pre: {
    body: { a: 1, b: 2 },
    attributes: { att_1: 'test', att_2: 1 }
  },
  post: {
    MessageBody: '{"a":1,"b":2}',
    MessageAttributes: {
      att_1: { DataType: 'String', StringValue: 'test' },
      att_2: { DataType: 'String', StringValue: '1' }
    },
    QueueUrl: 'TEST_QUEUE'
  }
};

module.exports.attributes = {
  pre: { att_1: 'test', att_2: 1, att_3: true },
  post: {
    att_1: { DataType: 'String', StringValue: 'test' },
    att_2: { DataType: 'String', StringValue: '1' },
    att_3: { DataType: 'String', StringValue: 'true' }
  }
};
