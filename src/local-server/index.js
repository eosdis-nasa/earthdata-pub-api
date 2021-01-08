const fs = require('fs');

const http = require('http');

const path = require('path');

const express = require('express');

const oasTools = require('oas-tools');

const jsyaml = require('js-yaml');

const bodyParser = require('body-parser');

const local = require('./controllers/local.js');

const serverPort = 8080;

const app = express();

app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/auth/login', local.login);
app.post('/auth/login', local.authenticate);
app.post('/auth/token', local.token);
app.get('/auth/user_list', local.userList);
app.get('/reseed', local.reseed);
app.get('/favicon.ico', local.favico);
app.post('/goaws/workflow_handler', local.handleWorkflow);

const spec = fs.readFileSync(path.join(__dirname, '/api/openapi.json'), 'utf8');
const oasDoc = jsyaml.safeLoad(spec);

const oasOptions = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true,
  oasSecurity: true,
  securityFile: {
    Authorizer: local.check
  }
};

oasTools.configure(oasOptions);

oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(serverPort, function() {
    console.log(`App running at http://localhost:${serverPort}`);
    console.log("_____________________________________________________");
    if (oasOptions.docs !== false) {
      console.log(`API docs at http://localhost:${serverPort}/docs`);
      console.log("___________________________________________________");
    }
  });
});

app.get('/instanceMeta', function(req, res) { res.status(200); res.send({}); });
app.get('/granules', function(req, res) { res.status(200); res.send([]); });
