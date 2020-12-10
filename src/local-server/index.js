const fs = require('fs');

const http = require('http');

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const auth = require('./auth.js');

const workflowHandler = require('workflow-handler').handler;

//const actionHandler = require('action-handler').handler;

const AWS = require('aws-sdk');

const { Consumer } = require('sqs-consumer');

const consumer = Consumer.create({
  sqs: new AWS.SQS({ endpoint: process.env.SNS_ENDPOINT }),
  queueUrl: 'http://goaws:4100/000000000000/edpub_action_sqs.fifo',
  pollingWaitTimeMs: 15000,
  //handleMessage: actionHandler
  handleMessage:  async (message) => {
    console.log(message);
  }
});

consumer.start();

const app = express();

app.use(bodyParser.json({
  strict: false
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const oasTools = require('oas-tools');
const jsyaml = require('js-yaml');
const serverPort = 8080;

const spec = fs.readFileSync(path.join(__dirname, '/api/openapi.json'), 'utf8');
const oasDoc = jsyaml.safeLoad(spec);

const options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};

oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(serverPort, function() {
    console.log(`App running at http://localhost:${serverPort}`);
    console.log("_____________________________________________________");
    if (options_object.docs !== false) {
      console.log(`API docs at http://localhost:${serverPort}/docs`);
      console.log("___________________________________________________");
    }
  });
});

app.options('/*', function(req, res) {
  res.send();
});

// app.get('/token', auth.tokenEndpoint);
// app.post('/refresh', auth.refreshEndpoint);
// app.delete('/token/:token', auth.deleteTokenEndpoint);
// app.delete('/tokenDelete/:token', auth.deleteTokenEndpoint);

app.post('/goaws/workflow_handler', function(req, res) {
  if (req.body.MessageAttributes.event_type.Value === 'workflow_promote_step') {
    const records = { Records: [ { Sns: { ...req.body } }] };
    workflowHandler(records);
  }
  res.statusCode = 200;
  res.send();
});


app.get('/instanceMeta', function(req, res) {
  res.send();
});

app.get('/granules', function(req, res) {
  res.send();
});
