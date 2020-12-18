'use strict';
const fs = require('fs');
const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  JsonWebTokenError,
  TokenExpiredError,
  sign,
  verify
} = require('jsonwebtoken');
const PgAdapter = require('database-driver');
const exp = 30 * 60 * 1000;

const tokenSecret = randomId('tokensecret');
const redirectEndpoint = `http://localhost:8080/token`;

function check(req, res, next) {
  const { authorization } = req.headers;
  if (authorization) {
    const [type, token] = authorization.split(' ');
    if (type === 'Bearer') {
      const { sub } = jwt.decode(token);
      if (sub) {
        Object.assign(req, { user_id: sub });
      }
    }
  }
  next();
}

function login(req, res) {
  return res
    .status(200)
    .sendFile(`${__dirname}/static/login.html`);
}

function token(req, res) {
  const user = req.body;
  if (user.id === 'register') {
    user.id = uuid.v4();
  }
  PgAdapter.execute({ resource: 'user', operation: 'loginUser'}, { user })
  .then((data) => {
    Object.assign(user, data);
    const authTime = Date.parse(user.last_login);
    Object.assign(user, {
      sub: user.id,
      scope: 'openid',
      auth_time: authTime,
      iss: 'Eartdata Pub Dev',
      exp: authTime + exp,
      iat: authTime
    });
    const newToken = jwt.sign(user, tokenSecret);
    const redirect = new URL('http://localhost:3000/auth')
    redirect.searchParams.set('token', newToken);
    res.status(200)
    res.send({ redirect: redirect.href });
  });
}

function userList(req, res) {
  PgAdapter.execute({ resource: 'user', operation: 'findAll' }, {})
  .then((users) => {
    res.status(200);
    res.send(users);
  });
}

function randomString(numBytes = 20) {
  return crypto.randomBytes(numBytes).toString('hex');
}

function randomId(id, numBytes = 5) {
  return `${id}${randomString(numBytes)}`;
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
  check,
  token,
  login,
  userList,
  ensureAuthorized
};
