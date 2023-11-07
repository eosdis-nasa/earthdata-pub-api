module.exports = {
  rootDir: './',
  projects: [
    '<rootDir>/src/nodejs/lambda-layers'
  ],
  testResultsProcessor: 'jest-bamboo-formatter'
};

process.env.TABLE_SUFFIX = '_TEST';
process.env.ACTION_BUCKET = 'TEST_BUCKET';
process.env.SNS_TOPIC = 'TEST_TOPIC';
process.env.SQS_QUEUE = 'TEST_QUEUE';
