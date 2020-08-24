/**
 * Parses an incoming SNS event message into a generalized and simplified
 * format.
 * @memberof MessageDriver
 * @param {object} message - AWS SNS message
 * @return {object} A message in simplified format
 *
 */
function parseSnsMessage(message) {
  const subject = message.Subject;
  const body = JSON.parse(message.Message);
  const attributes = Object.entries(message.MessageAttributes)
    .reduce((att, [key, val]) => {
      att[key] = val.Value;
      return att;
    }, {});
  const timestamp = new Date(message.Timestamp).toISOString();
  return {
    subject, body, attributes, timestamp
  };
}

/**
 * Parses an incoming SQS event message into a generalized and simplified
 * format.
 * @memberof MessageDriver
 * @param {object} message - AWS SQS message
 * @return {object} A message in simplified format
 *
 */
function parseSqsMessage(message) {
  const body = JSON.parse(message.body);
  const attributes = Object.entries(message.messageAttributes)
    .reduce((att, [key, val]) => {
      att[key] = val.stringValue;
      return att;
    }, {});
  const timestamp = new Date(message.attributes.ApproximateReceiveTimestamp).toISOString();
  return { body, attributes, timestamp };
}

/**
 * Receives either SQS or SNS message and calls the appropriate parsing
 * method.
 * @memberof MessageDriver
 * @param {object} message - AWS SNS/SQS message
 * @return {object} A message in simplified format
 *
 */
function parseRecord(record) {
  if (record.Sns) {
    return parseSnsMessage(record.Sns);
  } if (record.Sqs) {
    return parseSqsMessage(record.Sqs);
  }
  return {};
}

module.exports = parseRecord;
