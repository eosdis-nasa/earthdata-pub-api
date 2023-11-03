module.exports = {
  rootDir: './',
  projects: [
    '<rootDir>/src/nodejs'
  ],
  testResultsProcessor: 'jest-bamboo-formatter',
  collectCoverage: true,
  coverageThreshold:{
    global:{
      branches: 5,
      functions: 4,
      lines: 40,
    }
  }
};

process.env.TABLE_SUFFIX = '_TEST';
process.env.ACTION_BUCKET = 'TEST_BUCKET';
process.env.SNS_TOPIC = 'TEST_TOPIC';
process.env.SQS_QUEUE = 'TEST_QUEUE';
