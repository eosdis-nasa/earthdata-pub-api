/* eslint-disable max-classes-per-file */
// Disable this eslint rule to allow for mocking various AWS classes
const db = require('database-util');
const auth = require('auth-util');
const authHandler = require('../../auth.js');

db.user = jest.fn();
db.user.loginUser = jest.fn();
db.user.findById = jest.fn();
db.user.getRefreshToken = jest.fn();
db.user.refreshUser = jest.fn();

auth.getToken = jest.fn();
auth.refreshToken = jest.fn();
auth.getLoginUrl = jest.fn();
auth.getLogoutUrl = jest.fn();

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProviderClient: class {
    send() {
      return {};
    }

    promise() {
      return Promise.resolve({});
    }
  },
  GetUserCommand: class {},
  AssociateSoftwareTokenCommand: class { }
}));

describe('auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should preform the .code action', async () => {
    auth.getToken.mockReturnValue({ access: 'test', refresh: 'test', decoded: { sub: 'test' } });
    db.user.findById.mockReturnValue({ id: 'test' });
    const testEvent = {
      code: 'test',
      state: 'test'
    };
    const response = await authHandler.handler(testEvent);
    expect(response).toEqual({ token: 'test', state: 'test', user: { id: 'test' } });
  });
  it('should preform the .refresh and .context actions', async () => {
    db.user.getRefreshToken.mockReturnValue({ refresh_token: 'test' });
    auth.refreshToken.mockReturnValue({ access: 'test', refresh: 'test', decoded: { sub: 'test' } });
    db.user.findById.mockReturnValue({ id: 'test' });
    const testEvent = {
      refresh: true,
      context: { user_id: 'test' }
    };
    const response = await authHandler.handler(testEvent);
    expect(response).toEqual({ token: 'test', user: { id: 'test' } });
  });
  it('should preform the .logout action', async () => {
    auth.getLogoutUrl.mockReturnValue({ redirect: 'test' });
    const testEvent = {
      logout: true
    };
    const response = await authHandler.handler(testEvent);
    expect(response).toEqual({ redirect: 'test' });
  });
  it('should preform the default action', async () => {
    auth.getLoginUrl.mockReturnValue({ redirect: 'test' });
    const testEvent = {};
    const response = await authHandler.handler(testEvent);
    expect(response).toEqual({ redirect: 'test' });
  });
});
