const http = require('http')

function send({ endpoint, options, headers, method, code, payload }) {
  const data = payload ? JSON.stringify(payload) : false;
  const url = new URL(endpoint);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname.concat(url.search),
    method: method.toUpper(),
    headers: {
      ...(data ? {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      } : {}),
      ...headers
    },
    ...options
  };
  const promise = new Promise((resolve) => {
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        if (res.statusCode == code) {
          const message = chunks.length > 0 ? chunks.join('') : false;
          console.info(`[INFO] Request resolved successfully.${message ? `Response: ${message}`}`);
          resolve(true);
        }
        else {
          console.info(`[ERROR] Request resolved with status code of ${res.statusCode}.`);
          resolve(false);
        }
      })
    });
    req.on('error', (error) => {
      console.info(`[ERROR] ${error}`);
      resolve(false);
    });
    if (data) {
      req.write(data);
    }
    req.end();
  });
  return promise;
}

module.exports.send = send;
