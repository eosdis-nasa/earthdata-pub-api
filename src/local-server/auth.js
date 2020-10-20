'use strict';
const crypto = require('crypto');

const {
  JsonWebTokenError,
  TokenExpiredError,
  sign,
  verify
} = require('jsonwebtoken');

const username = 'testUser';
const tokenSecret = randomId('tokensecret');
const redirectEndpoint = `http://localhost:8080/token`;

function createJwtToken({ accessToken, expirationTime, username }) {
  // JWT expiration time is in seconds, not milliseconds
  const exp = Math.floor(expirationTime / 1000);
  return sign({
    exp,
    accessToken,
    username
  }, tokenSecret, {
    algorithm: 'HS256',
    noTimestamp: true
  });
};

function verifyJwtToken(jwtToken, params = {}) {
  const options = { algorithms: ['HS256'], ...params };
  return verify(jwtToken, tokenSecret, options);
};

let accessToken;
const newToken = () => {
  accessToken = randomId('oauthcode');
  const expirationTime = new Date(Date.now() + 3600 * 24 * 1000);
  return createJwtToken({ accessToken, username, expirationTime });
};

let jwt = newToken();

/**
 * performs OAuth against an OAuth provider
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @returns {Promise<Object>} the promise of express response object
 */
async function tokenEndpoint(req, res) {
  const code = req.query.code;
  const state = req.query.state;
  if (jwt === '') jwt = newToken();

  if (code) {
    if (state) {
      return res
        .status(307)
        .set({ Location: `${decodeURIComponent(state)}?token=${jwt}` })
        .send('Redirecting');
    }
    return res.send({
      message: {
        token: jwt
      }
    });
  }

  let uri = `${redirectEndpoint}?code=somecode`;
  if (state) {
    uri += `&state=${encodeURIComponent(state)}`;
  }

  return res
    .status(307)
    .set({ Location: uri })
    .send('Redirecting');
}

/**
 * refreshes an OAuth token completely, without any check that the initial
 * token was valid. Used in testing only.
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @returns {Promise<Object>} the promise of express response object
 */
async function refreshEndpoint(req, res) {
  jwt = newToken();
  return res.send({
    message: {
      token: jwt
    }
  });
}

function randomString(numBytes = 20) {
  return crypto.randomBytes(numBytes).toString('hex');
}

function randomId(id, numBytes = 5) {
  return `${id}${randomString(numBytes)}`;
}


/**
 * Handle token deletion
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @returns {Promise<Object>} a promise of an express response
 */
async function deleteTokenEndpoint(req, res) {
  jwt = '';
  return res.send({ message: 'Token record was deleted' });
}

/**
 * An express middleware that checks if an incoming express
 * request is authenticated
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {Function} next - express middleware callback function
 * @returns {Promise<Object>} - promise of an express response object
 */
async function ensureAuthorized(req, res, next) {
  // Verify that the Authorization header was set in the request
  const authorizationKey = req.headers.authorization;
  if (!authorizationKey) {
    return res.boom.unauthorized('Authorization header missing');
  }
  // Parse the Authorization header
  const [scheme, jwtToken] = req.headers.authorization.trim().split(/\s+/);

  // Verify that the Authorization type was "Bearer"
  if (scheme !== 'Bearer') {
    return res.boom.unauthorized('Authorization scheme must be Bearer');
  }

  if (!jwtToken) {
    return res.boom.unauthorized('Missing token');
  }

  let userName;
  try {
    ({ username: userName } = verifyJwtToken(jwtToken));

    if (userName !== username) {
      return res.boom.unauthorized('User not authorized');
    }

    req.authorizedMetadata = { userName };
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.boom.unauthorized('Access token has expired');
    }

    if (error instanceof JsonWebTokenError) {
      return res.boom.forbidden('Invalid access token');
    }

    return res.boom.badImplementation(error.message);
  }
}

module.exports = {
  tokenEndpoint,
  refreshEndpoint,
  deleteTokenEndpoint,
  ensureAuthorized
};
