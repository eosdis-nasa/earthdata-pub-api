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

const issuer = 'Earthdata Pub Dev';
const tokenSecret = 'earthdata_pub_dev';
const redirectEndpoint = `http://localhost:8080/token`;

function check(req, res, next) {
  const { authorization } = req.headers;
  if (authorization) {
    const [type, token] = authorization.split(' ');
    if (type === 'Bearer') {
      const { sub } = jwt.decode(token);
      if (sub) {
        Object.assign(req, { user_id: { value: sub } });
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
      iss: issuer,
      exp: authTime + exp,
      iat: authTime
    });
    const newToken = jwt.sign(user, tokenSecret, { algorithm: 'HS256'});
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

function verifyToken(req, secDef, token, next) {
  const bearerRegex = /^Bearer\s/;

  if (token && bearerRegex.test(token)) {
    var newToken = token.replace(bearerRegex, '');
    jwt.verify(newToken, tokenSecret, { issuer },
      (error, decoded) => {
        if (error === null && decoded) {
          Object.assign(req, { user_id: decoded.sub });
          return next();
        }
        return next(req.res.sendStatus(401));
      }
    );
  } else {
    return next(req.res.sendStatus(403));
  }
}

function randomString(numBytes = 20) {
  return crypto.randomBytes(numBytes).toString('hex');
}

function randomId(id, numBytes = 5) {
  return `${id}${randomString(numBytes)}`;
}


module.exports = {
  issuer,
  tokenSecret,
  verifyToken,
  token,
  login,
  userList
};
