/* eslint-disable no-await-in-loop */
const { CognitoIdentityProvider } = require('@aws-sdk/client-cognito-identity-provider');
const db = require('database-util');

const cognito = new CognitoIdentityProvider({ region: process.env.REGION });
const userPoolId = process.env.USER_POOL_ID;

/**
 * Fetch all enabled Cognito users.
 */
async function listAllEnabledUsers() {
  const users = [];
  let paginationToken;

  do {
    const res = await cognito.listUsers({
      UserPoolId: userPoolId,
      Filter: 'status = "Enabled"',
      PaginationToken: paginationToken
    });

    if (res.Users) users.push(...res.Users);
    paginationToken = res.PaginationToken;
  } while (paginationToken);

  return users.reduce((map, user) => {
    const attrs = Object.fromEntries(user.Attributes.map((a) => [a.Name, a.Value]));
    // included more attributes in case required but everything below is not needed
    if (attrs.sub) {
      map.set(attrs.sub, {
        username: user.Username,
        enabled: user.Enabled,
        email: attrs.email || 'N/A',
        status: user.UserStatus
      });
    }
    return map;
  }, new Map());
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
    const inactiveSubs = new Set(inactiveUsers.map((u) => u.id));

    // Step 2: Fetch all enabled Cognito users
    const cognitoUsers = await listAllEnabledUsers();

    // Step 3: Check Cognito for each inactive user
    const results = await Promise.all(
      Array.from(cognitoUsers.entries()).map(async ([sub, cognitoUser]) => {
        if (!inactiveSubs.has(sub)) return null; // Skip non-matching users
        try {
          await cognito.adminDisableUser({
            UserPoolId: userPoolId,
            Username: cognitoUser.username
          });
          return { id: sub, username: cognitoUser.username, disabled: true };
        } catch (err) {
          console.error(`Failed to disable ${cognitoUser.username}:`, err.message);
          return { id: sub, username: cognitoUser.username, disabled: false };
        }
      })
    );

    const disabledResults = results.filter((result) => result !== null);

    return {
      message: `Disabled ${disabledResults.length} inactive users.`,
      results: disabledResults
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error running maintainUserAccount:', err);
    throw err;
  }
};
