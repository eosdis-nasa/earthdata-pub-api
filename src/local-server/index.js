const fs = require('fs');

const http = require('http');

const path = require('path');

const express = require("express");

const bodyParser = require('body-parser');

// const AWS = require('aws-sdk');
//
// const { Consumer } = require('sqs-consumer');
//
// AWS.config.update({
//   region: 'us-east-1',
//   accessKeyId: 'fake',
//   secretAccessKey: 'fake'
// });
//
// const consumer = Consumer.create({
//   queueUrl: 'http://goaws/edpub_queue_local.fifo',
//   handleMessage: async (message) => {
//     console.log(message);
//   }
// });
//
// consumer.start();

const app = express();
app.use(bodyParser.json({
  strict: false
}));
const oasTools = require('oas-tools');
const jsyaml = require('js-yaml');
const serverPort = 8080;

const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.json'), 'utf8');
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
    console.log("App running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (options_object.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.log("________________________________________________________________");
    }
  });
});

app.get('/favicon.ico', express.static('favicon.ico'));

app.get('/info', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title
  });
});

app.post('/goawsmq', function(req, res) {
  res.send(req);
});
