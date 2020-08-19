module.exports = {
  rootDir: './',
  projects: [
    '<rootDir>/action-handler',
    '<rootDir>/dashboard',
    '<rootDir>/database-driver',
    '<rootDir>/information',
    '<rootDir>/invoke',
    '<rootDir>/message-driver',
    '<rootDir>/notification-handler',
    '<rootDir>/notify',
    '<rootDir>/register',
    '<rootDir>/submission',
    '<rootDir>/subscription',
    '<rootDir>/workflow-handler'
  ],
  testResultsProcessor: 'jest-bamboo-formatter'
};

process.env.TABLE_SUFFIX = '_TEST';
process.env.ACTION_BUCKET = 'TEST_BUCKET';
process.env.SNS_TOPIC = 'TEST_TOPIC';
process.env.SQS_QUEUE = 'TEST_QUEUE';
