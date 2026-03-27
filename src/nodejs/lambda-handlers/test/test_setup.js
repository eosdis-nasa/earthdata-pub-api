const path = require('path');
const { PostgreSqlContainer } = require('@testcontainers/postgresql');

const runIntegration = process.env.RUN_INTEGRATION || false;

module.exports = async () => {
  // Only setup the docker if we're running integration tests
  if (runIntegration) {
    // Paths to the files we need for initialization
    const pgInit = path.resolve(__dirname, '../../../postgres/1-init.sql');
    const pgTables = path.resolve(__dirname, '../../../postgres/2-tables.sql');
    const pgFunctions = path.resolve(__dirname, '../../../postgres/4-functions.sql');
    const pgTriggers = path.resolve(__dirname, '../../../postgres/5-triggers.sql');
    const pgAggregates = path.resolve(__dirname, '../../../postgres/6-aggregates.sql');
    const pgSeed = path.resolve(__dirname, '../../../postgres/7-seed.sql');
    const pgTestSeed = path.resolve(__dirname, './test_seed.sql');

    // Use pre-defined container class for postgres table
    const container = await new PostgreSqlContainer('postgres')
      .withDatabase('postgres')
      .withPassword('secret')
      .withUser('postgres')
      .withCopyFilesToContainer([
        { source: pgInit, target: '/docker-entrypoint-initdb.d/1-init.sql' },
        { source: pgTables, target: '/docker-entrypoint-initdb.d/2-tables.sql' },
        { source: pgFunctions, target: '/docker-entrypoint-initdb.d/4-functions.sql' },
        { source: pgTriggers, target: '/docker-entrypoint-initdb.d/5-triggers.sql' },
        { source: pgAggregates, target: '/docker-entrypoint-initdb.d/6-aggregates.sql' },
        { source: pgSeed, target: '/docker-entrypoint-initdb.d/7-seed.sql' },
        { source: pgTestSeed, target: '/docker-entrypoint-initdb.d/test-seed.sql' }
      ])
      .start();

    // Set environment variables for the test database to be accessed in the database-util script
    process.env.TESTDB_USER = container.getUsername();
    process.env.TESTDB_HOST = container.getHost();
    process.env.TESTDB_DB = container.getDatabase();
    process.env.TESTDB_PW = container.getPassword();
    process.env.TESTDB_PORT = container.getPort();

    global.TESTCONTAINER = container;
  }
};
