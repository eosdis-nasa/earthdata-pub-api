const db = require('database-util');

exports.handler = async (event) => {
  console.info('[EVENT]', JSON.stringify(event));

  try {
    console.info('Fetching users inactive for more than 1 year...');

    // Uses existing database-util function
    const inactiveUsers = await db.user.getInactiveUsers();

    if (!inactiveUsers || inactiveUsers.length === 0) {
      console.info('No inactive users found.');
      return { message: 'No inactive users found' };
    }

    console.info(`Found ${inactiveUsers.length} inactive users:`);
    inactiveUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email || 'no email'}) — Last login: ${user.last_login}`);
    });

    return {
      statusCode: 200,
      count: inactiveUsers.length,
      users: inactiveUsers
    };

  } catch (error) {
    console.error('Error while fetching inactive users:', error);
    return {
      statusCode: 500,
      error: error.message
    };
  }
};
