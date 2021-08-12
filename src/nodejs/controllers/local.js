const fs = require('fs');
const uuid = require('uuid');
const { sign, verify, decode } = require('jsonwebtoken');
const DatabaseUtil = require('database-util');
const handlers = require('./handlers.js');

const issuer = 'Earthdata Pub Dev';
const tokenSecret = 'earthdata_pub_dev';
const exp = parseInt(process.env.AUTH_TOKEN_EXP);
const redirectEndpoint = process.env.AUTH_CALLBACK_URL;
const respectExp = process.env.AUTH_RESPECT_EXP === 'true';
const codes = {};

function aclAllowAll(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}

function login(req, res) {
  return res
    .status(200)
    .sendFile(`${__dirname}/static/login.html`);
}

function authenticate(req, res) {
  const code = uuid.v4().replace(/-/g, '');
  const { state, ...user } = req.body;
  if (user.id === 'register') {
    user.id = uuid.v4();
    user.refresh_token = code;
  }
  DatabaseUtil.execute({ resource: 'user', operation: 'loginUser' }, { user })
    .then((data) => {
      Object.assign(user, data);
      const authTime = Math.floor(Date.parse(user.last_login) / 1000);
      Object.assign(user, {
        sub: user.id,
        scope: 'openid',
        auth_time: authTime,
        iss: issuer,
        exp: authTime + exp,
        iat: authTime
      });
      // const newToken = sign(user, tokenSecret, { algorithm: 'HS256'});
      codes[code] = user;

      const redirect = new URL('http://localhost:3000/auth');
      redirect.searchParams.set('code', code);
      if (state) redirect.searchParams.set('state', state);
      res.status(200);
      res.send({ redirect: redirect.href });
    });
}

function getToken(req, res) {
  const { code, refresh_token } = req.body;
  if (code) {
    const authTime = Math.floor(Date.now() / 1000);
    const user = codes[code];
    Object.assign(user, {
      auth_time: authTime,
      exp: authTime + exp,
      iat: authTime
    });
    const token = sign(user, tokenSecret, { algorithm: 'HS256' });
    const tokens = {
      id_token: token,
      access_token: token,
      refresh_token: code,
      expires_in: exp,
      token_type: 'Bearer'
    };
    console.info(tokens);
    setTimeout(function() {
      res.status(200);
      res.send(tokens);
    }, 3000);
  } else if (refresh_token) {
    const authTime = Math.floor(Date.now() / 1000);
    const user = codes[refresh_token];
    Object.assign(user, {
      auth_time: authTime,
      exp: authTime + exp,
      iat: authTime
    });
    const token = sign(user, tokenSecret, { algorithm: 'HS256' });
    const tokens = {
      id_token: token,
      access_token: token,
      refresh_token,
      expires_in: exp,
      token_type: 'Bearer'
    };
    console.info(tokens);
    setTimeout(function() {
      res.status(200);
      res.send(tokens);
    }, 3000);
  }
}

function userList(req, res) {
  DatabaseUtil.execute({ resource: 'user', operation: 'findAll' }, {})
    .then((users) => {
      res.status(200);
      res.send(users);
    });
}

function groupList(req, res) {
  DatabaseUtil.execute({ resource: 'group', operation: 'findAll' }, {})
    .then((groups) => {
      res.status(200);
      res.send(groups);
    });
}

function roleList(req, res) {
  DatabaseUtil.execute({ resource: 'role', operation: 'findAll' }, {})
    .then((roles) => {
      res.status(200);
      res.send(roles);
    });
}

function check(req, secDef, token, next) {
  const bearerRegex = /^Bearer\s/;
  if (token && bearerRegex.test(token)) {
    const newToken = token.replace(bearerRegex, '');
    verify(newToken, tokenSecret, { issuer },
      (error, decoded) => {
        if (error === null && decoded) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (respectExp && decoded.exp < currentTime) {
            next(req.res.sendStatus(403));
          }
          DatabaseUtil.execute({ resource: 'user', operation: 'findById' },
            { user: { id: decoded.sub } }).then((user) => {
            if (user.error) { return next(req.res.sendStatus(403)); }
            Object.assign(req, { user_id: decoded.sub });
            return next();
          });
        } else {
          return next(req.res.sendStatus(403));
        }
      });
  } else {
    return next(req.res.sendStatus(403));
  }
}

function reseed(req, res) {
  DatabaseUtil.seed().then((response) => {
    res.status(200);
    res.send();
  });
}

function favico(req, res) {
  res.status(200);
  res.sendFile(`${__dirname}/static/favicon.ico`);
}

function handleWorkflow(req, res) {
  if (req.body.MessageAttributes.event_type.Value === 'workflow_promote_step') {
    const records = { Records: [{ Sns: { ...req.body } }] };
    handlers.workflowConsumer(records);
  }
  res.status(200);
  res.send();
}

function handleNotification(req, res) {
  handlers.notificationConsumer(wrapSns(req)).then((body) => {
    res.status(body.statusCode);
    res.send();
  });
}

function handleMetrics(req, res) {
  handlers.metricsConsumer(wrapSns(req)).then((body) => {
    res.status(body.statusCode);
    res.send();
  });
}

function wrapSns(req) {
  return { Records: [{ Sns: { ...req.body } }] };
}

function dbTest(req, res) {
  const { resource, operation, params } = req.body;
  DatabaseUtil.execute({ resource, operation }, params)
    .then((data) => {
      res.status(200);
      res.send(data);
    });
}

module.exports = {
  aclAllowAll,
  issuer,
  tokenSecret,
  getToken,
  login,
  authenticate,
  check,
  userList,
  groupList,
  roleList,
  reseed,
  handleWorkflow,
  handleMetrics,
  handleNotification,
  dbTest,
  favico
};
