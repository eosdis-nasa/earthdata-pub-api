const db = require('database-util');

exports.handler = async (event) => {
  console.info('[EVENT]', JSON.stringify(event));

  try {
    console.info('Fetching users inactive for more than 1 year...');
    const inactiveUsers = await db.user.getInactiveUsers();

    if (!inactiveUsers || inactiveUsers.length === 0) {
      console.info('No inactive users found.');
      return { message: 'No inactive users found' };
    }
    return {};
  } catch (error) {
    console.error('Error while fetching inactive users:', error);
    return {
      statusCode: 500,
      error: error.message
    };
  }
};
