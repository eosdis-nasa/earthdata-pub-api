const { CognitoIdentityProvider } = require('@aws-sdk/client-cognito-identity-provider');
const db = require('database-util');

// Initialize AWS Cognito client
const cognito = new CognitoIdentityProvider({ region: process.env.REGION });
const userPoolId = process.env.USER_POOL_ID;

/**
 * Get Cognito user by sub (UUID) and return info if enabled.
 */
async function getEnabledUserBySub(sub) {
  try {
    const res = await cognito.listUsers({
      UserPoolId: userPoolId,
      Filter: `sub = "${sub}"`
    });

    if (!res.Users || res.Users.length === 0) {
      return null;
    }

    const [user] = res.Users;

    const attrs = {};
    user.Attributes.forEach((attr) => {
      attrs[attr.Name] = attr.Value;
    });

    if (!user.Enabled) return null;
    // included more attributes in case required but everything below is not needed
    return {
      sub,
      username: user.Username,
      enabled: user.Enabled,
      name: attrs.name || 'N/A',
      email: attrs.email || 'N/A',
      status: user.UserStatus
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching Cognito user for sub ${sub}:`, err);
    return null;
  }
}

/**
 * Lambda Handler — disables users in Cognito that have been inactive for over 1 year.
 */
exports.handler = async (event) => {
  // eslint-disable-next-line no-console
  console.log(`[EVENT] ${JSON.stringify(event)}`);

  try {
    // Step 1: Get inactive users from DB
    const inactiveUsers = await db.user.getInactiveUsers();

    const skipped = [];

    // Step 2: Check Cognito for each inactive user
    const results = await Promise.all(
      inactiveUsers.map(async (user) => {
        const cognitoUser = await getEnabledUserBySub(user.id);
        if (!cognitoUser) {
          skipped.push(user.id);
          return null;
        }

        try {
          await cognito.adminDisableUser({
            UserPoolId: userPoolId,
            Username: cognitoUser.username
          });

          return { id: user.id, disabled: true };
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`Failed to disable user ${cognitoUser.username}:`, err);
          return { id: user.id, disabled: false };
        }
      })
    );

    const disabledCount = results.filter((r) => r && r.disabled).length;

    return { message: `Processed ${inactiveUsers.length} users. ${disabledCount} should be disabled.` };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error running maintainUserAccount:', err);
    throw err;
  }
};
