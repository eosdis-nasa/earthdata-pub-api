'use strict';
const fs = require('fs');
const uuid = require('uuid');
const { sign, verify } = require('jsonwebtoken');
const DatabaseUtil = require('database-util');
const { SQS } = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const handlers = require('./handlers.js');

const issuer = 'Earthdata Pub Dev';
const tokenSecret = 'earthdata_pub_dev';
const exp = 30 * 60 * 1000;
const redirectEndpoint = process.env.AUTH_CALLBACK_URL;
const respectExp = process.env.AUTH_RESPECT_EXP === 'true';
const codes = {};

const consumer = Consumer.create({
  sqs: new SQS({ endpoint: process.env.SNS_ENDPOINT }),
  queueUrl: 'http://goaws:4100/000000000000/edpub_action_sqs',
  pollingWaitTimeMs: 15000,
  handleMessage: handlers.actionConsumer
});

consumer.start();

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
  const code = uuid.v4().replace(/-/g, "");
  const refresh = uuid.v4().replace(/-/g, "");
  const { state, ...user } = req.body;
  if (user.id === 'register') {
    user.id = uuid.v4();
    user.refresh_token = 'none';
  }
  DatabaseUtil.execute({ resource: 'user', operation: 'loginUser'}, { user })
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
    const newToken = sign(user, tokenSecret, { algorithm: 'HS256'});
    codes[code] = {
      id_token: newToken,
      access_token: newToken,
      refresh_token: refresh,
      expires_in: exp,
      token_type: "Bearer"
    };
    const redirect = new URL('http://localhost:3000/auth')
    redirect.searchParams.set('code', code);
    if (state) redirect.searchParams.set('state', state);
    res.status(200)
    res.send({ redirect: redirect.href });
  });
}

function token(req, res) {
  const { code } = req.body;
  const tokens = codes[code];
  console.info(tokens);
  res.status(200);
  res.send(tokens);
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
          if (respectExp && decoded.exp < Date.now()) { next(req.res.sendStatus(403)); }
          DatabaseUtil.execute({ resource: 'user', operation: 'findById' },
          { user: { id: decoded.sub } }).then((user) => {
            if (user.error) { return next(req.res.sendStatus(403)) }
            Object.assign(req, { user_id: decoded.sub });
            return next();
          });
        } else {
          return next(req.res.sendStatus(403));
        }
      }
    );
  } else {
    return next(req.res.sendStatus(403));
  }
}

function reseed(req, res) {
  DatabaseUtil.seed().then((response) => {
    res.status(200);
    res.send();
  })
}

function favico(req, res) {
  res.status(200);
  res.sendFile(`${__dirname}/static/favicon.ico`);
}

function handleWorkflow(req, res) {
  if (req.body.MessageAttributes.event_type.Value === 'workflow_promote_step') {
    const records = { Records: [ { Sns: { ...req.body } }] };
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
  return { Records: [ { Sns: { ...req.body } }] };
}

function kayakoMock(req, res) {
  // Placeholder that logs requests, will update to return useful mock values
  console.info('Headers: ', JSON.stringify(req.headers || {}));
  console.info('Query: ', JSON.stringify(req.query || {}));
  console.info('Request Body: ', JSON.stringify(req.body || {}));
  res.status(200);
  res.send();
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
  token,
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
  kayakoMock,
  dbTest,
  favico
};
