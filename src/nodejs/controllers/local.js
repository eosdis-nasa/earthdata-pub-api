const fs = require('fs');
const uuid = require('uuid');
const { sign, verify, decode } = require('jsonwebtoken');
const db = require('database-util');
const handlers = require('./handlers.js');

const issuer = 'Earthdata Pub Dev';
const tokenSecret = 'earthdata_pub_dev';
const exp = parseInt(process.env.AUTH_TOKEN_EXP);
const redirectEndpoint = process.env.AUTH_CALLBACK_URL;
const respectExp = process.env.AUTH_RESPECT_EXP === 'true';
const codes = {};

const workflowEventFilter = ['request_initialized', 'workflow_resume', 'form_submitted', 'review_approved', 'review_rejected'];

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
  const { state, ...data } = req.body;
  if (data.new_user) {
    data.id = uuid.v4();
  }
  data.refresh_token = code;
  db.user.loginUser(data)
  .then(() => {
    if (data.new_user && data.user_roles.length > 0) {
      return db.user.addRoles(data)
    }
  })
  .then(() => {
    if (data.new_user && data.user_groups.length > 0) {
      return db.user.addGroups(data);
    }
  })
  .then(() => {
    return db.user.findById(data);
  })
  .then((user) => {
    const authTime = Math.floor(Date.parse(user.last_login) / 1000);
    const tokenBase = {
      sub: user.id,
      name: user.name,
      email: user.email,
      scope: 'openid',
      auth_time: authTime,
      iss: issuer,
      exp: authTime + exp,
      iat: authTime
    };

    codes[code] = tokenBase;

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
    res.status(200);
    res.send(tokens);
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
    res.status(200);
    res.send(tokens);
  }
}

function userList(req, res) {
  db.user.findAll()
    .then((users) => {
      res.status(200);
      res.send(users);
    });
}

function groupList(req, res) {
  db.group.findAll()
    .then((groups) => {
      res.status(200);
      res.send(groups);
    });
}

function roleList(req, res) {
  db.role.findAll()
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
          db.user.findById({ id: decoded.sub })
          .then((user) => {
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

async function checkService(req, secDef, token, next) {
  const auth = token.split(' ')[1] || '';
  const authStr = Buffer.from(auth, 'base64').toString();
  const splitIndex = authStr.indexOf(':');
  const serviceId = authStr.substring(0, splitIndex);
  const serviceSecret = authStr.substring(splitIndex + 1);
  if (!uuid.validate(serviceId)) { return next(req.res.sendStatus(403)); }
  const { secret: dbSecret, submission_id: dbSubmissionId } = await db.service.findSecret({ id: serviceId });
  if (dbSecret === serviceSecret && dbSubmissionId === req.headers.submissionid) { return next(); }
  return next(req.res.sendStatus(403));
}

function reseed(req, res) {
  db.seed().then((response) => {
    res.status(200);
    res.send();
  });
}

function favico(req, res) {
  res.status(200);
  res.sendFile(`${__dirname}/static/favicon.svg`);
}

function handleWorkflow(req, res) {
  const eventType = req.body.MessageAttributes.event_type.Value;
  if (workflowEventFilter.includes(eventType)) {
    handlers.workflowConsumer(wrapSns(req)).then((body) => {
      res.status(body.statusCode);
      res.send();
    });
  } else {
    res.status(200);
    res.send();
  }
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
  db[resource][operation](params)
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
  favico,
  checkService
};
