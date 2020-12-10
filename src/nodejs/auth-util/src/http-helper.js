const http = require('http');
const https = require('https');

const protocols = { http, https };

const mimeTypes = {
  json: 'application/json',
  form: 'application/x-www-form-urlencoded'
};

const contentEncoder = {
  json: (data) => { return JSON.stringify(data); },
  form: (data) => { return new URLSearchParams(data).toString(); }
};

function encodeBase64(data) {
  return Buffer.from(data).toString('base64');
}

function authHeader({ type, ...credentials }) {
  const header = {};
  if (type === 'basic') {
    const { username, password } = credentials;
    const creds = encodeBase64(`${username}:${password}`);
    header.Authorization = `Basic ${creds}`;
  }
  else if (type === 'bearer') {
    const { token } = credentials;
    header.Authorization = `Bearer ${token}`
  }
  return header;
}

function contentHeader(type, length) {
  return {
    'Content-Type': mimeTypes[type],
    'Content-Length': length
  }
}

function stringifyPayload(payload) {
  if (payload) {
    const { type, data } = payload;
    const content = contentEncoder[type](data);
    const contentHeaders = contentHeader(type, content.length);
    return { content, contentHeaders }
  } else {
    return { content: false, contentHeaders: false }
  }
}

function send({ method, endpoint, headers, auth, payload }) {
  const { content, contentHeaders } = stringifyPayload(payload);
  const url = new URL(endpoint);
  const reqOptions = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname.concat(url.search),
    method: method.toUpperCase(),
    headers: {
      ...(headers ? headers : {}),
      ...(contentHeaders ? contentHeaders : {}),
      ...(auth ? authHeader(auth) : {}),
    }
  };
  const promise = new Promise((resolve) => {
    const protocol = protocols[url.protocol.slice(0, -1)];
    const req = protocol.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        console.log(chunks.join(''))
        resolve(JSON.parse(chunks.join('')));
      });
    });
    req.on('error', (error) => {
      resolve(error);
    });
    if (content) {
      req.write(content);
    }
    req.end();
  });
  return promise;
}

module.exports.send = send;
