module.exports = {
  rootDir: './',
  projects: [
    '<rootDir>/src/nodejs/action-handler',
    '<rootDir>/src/nodejs/dashboard',
    '<rootDir>/src/nodejs/database-driver',
    '<rootDir>/src/nodejs/data',
    '<rootDir>/src/nodejs/invoke',
    '<rootDir>/src/nodejs/message-driver',
    '<rootDir>/src/nodejs/metrics-handler',
    '<rootDir>/src/nodejs/model',
    '<rootDir>/src/nodejs/notification-handler',
    '<rootDir>/src/nodejs/notify',
    '<rootDir>/src/nodejs/register',
    '<rootDir>/src/nodejs/submission',
    '<rootDir>/src/nodejs/subscription',
    '<rootDir>/src/nodejs/workflow-handler',
    '<rootDir>/src/nodejs/schema-util'
  ],
  testResultsProcessor: 'jest-bamboo-formatter'
};

process.env.TABLE_SUFFIX = '_TEST';
process.env.ACTION_BUCKET = 'TEST_BUCKET';
process.env.SNS_TOPIC = 'TEST_TOPIC';
process.env.SQS_QUEUE = 'TEST_QUEUE';
