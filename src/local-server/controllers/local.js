'use strict';
const fs = require('fs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { sign, verify } = require('jsonwebtoken');
const PgAdapter = require('database-driver');
const { SQS } = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const workflowHandler = require('workflow-handler').handle;
//const actionHandler = require('action-handler').handle;
const actionHandler = async (message) => { console.log(message) }

const issuer = 'Earthdata Pub Dev';
const tokenSecret = 'earthdata_pub_dev';
const exp = 300 * 60 * 1000;
const redirectEndpoint = `http://localhost:8080/token`;
const codes = {};

const consumer = Consumer.create({
  sqs: new SQS({ endpoint: process.env.SNS_ENDPOINT }),
  queueUrl: 'http://goaws:4100/000000000000/edpub_action_sqs.fifo',
  pollingWaitTimeMs: 15000,
  handleMessage: actionHandler
});

consumer.start();

function login(req, res) {
  return res
    .status(200)
    .sendFile(`${__dirname}/static/login.html`);
}

function authenticate(req, res) {
  const code = uuid.v4().replace(/-/g, "");
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
    codes[code] = {
      id_token: newToken,
      access_token: newToken,
      refresh_token: newToken,
      expires_in: exp,
      token_type: "Bearer"
    };
    const redirect = new URL('http://localhost:3000/auth')
    redirect.searchParams.set('code', code);
    res.status(200)
    res.send({ redirect: redirect.href });
  });
}

function token(req, res) {
  const { code } = req.body;
  const tokens = codes[code];
  console.log(tokens);
  res.status(200);
  res.send(tokens);
}

function userList(req, res) {
  PgAdapter.execute({ resource: 'user', operation: 'findAll' }, {})
  .then((users) => {
    res.status(200);
    res.send(users);
  });
}

function check(req, secDef, token, next) {
  const bearerRegex = /^Bearer\s/;
  if (token && bearerRegex.test(token)) {
    var newToken = token.replace(bearerRegex, '');
    jwt.verify(newToken, tokenSecret, { issuer },
      (error, decoded) => {
        if (error === null && decoded) {
          Object.assign(req, { user_id: decoded.sub });
          return next();
        }
        return next(req.res.sendStatus(403));
      }
    );
  } else {
    return next(req.res.sendStatus(403));
  }
}

function reseed(req, res) {
  PgAdapter.seed().then(() => {
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
    workflowHandler(records);
  }
  res.status(200);
  res.send();
}

module.exports = {
  issuer,
  tokenSecret,
  token,
  login,
  authenticate,
  check,
  userList,
  reseed,
  handleWorkflow,
  favico
};
