const http = require('http');
const { Lambda } = require("@aws-sdk/client-lambda");

const region = process.env.REGION;
const lambda = new Lambda({ region });

function invoke(method, headers, url, payload) {
  return lambda.invoke({
    FunctionName: 'api_proxy',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ method, headers, url, payload })
  })
    .then(({ Payload }) => JSON.parse(Payload));
}

http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });
  req.on('end', () => {
    const { method, url } = req;
    const { host, ...headers } = req.headers;
    const payload = chunks.length > 0 ? chunks.join('') : null;
    invoke(method, headers, url, payload)
      .then(({ statusCode, statusMessage, headers, body }) => {
        res.writeHead(statusCode, statusMessage, headers);
        res.write(body);
        res.end();
      });
  });
}).listen(8080);
