/**
 * Lambda Layer for interacting with the Kayako REST API
 * @module Version
 */
const crypto = require('crypto');
const querystring = require('querystring');
const https = require('https');
const xml2js = require('xml2js');

const apiKey = process.env.APIKEY;
const secretKey = process.env.SECRETKEY;
const hostName = process.env.HOSTNAME;
const saltLength = process.env.SALTLENGTH ? process.env.SALTLENGTH : 10;

function generateSignature(salt) {
  return crypto.createHmac('sha256', secretKey).update(salt).digest('base64');
}

function generateAuthentication() {
  const salt = crypto.randomBytes(saltLength).toString('hex');
  return {
    apikey: apiKey,
    salt,
    signature: generateSignature(salt)
  };
}

function generateEndpoint(method, urlObj) {
  if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
    const newUrl = { ...generateAuthentication(), ...urlObj };
    return `${hostName}/api/index.php?${querystring.stringify(newUrl)}`;
  }
  return `${hostName}/api/index.php?${querystring.stringify(urlObj)}`;
}

function send(method, urlObj, data) {
  const url = new URL(generateEndpoint(method, urlObj));
  const reqOptions = {
    hostname: url.hostname,
    path: url.pathname.concat(url.search),
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  return new Promise((resolve) => {
    const req = https.request(reqOptions, (res) => {
      let resData = '';
      res.on('data', (chunk) => {
        resData += chunk;
      });
      res.on('end', () => {
        const parser = new xml2js.Parser({ explicitArray: false });
        parser.parseString(resData, (err, result) => {
          try {
            resolve(JSON.parse(JSON.stringify(result, null, 2)));
          } catch (e) {
            console.info(`Error: ${resData}`);
          }
        });
      });
      res.on('error', (e) => {
        console.info(`Error: ${e}`);
      });
    });
    req.on('error', (error) => {
      resolve(error);
    });
    if (data) {
      req.write(querystring.stringify(data));
    }
    req.end();
  });
}

async function getTestAPI() {
  return send('get', { e: '/Core/TestApi' });
}

async function getAllEDPubTickets() {
  return send('get', { e: '/Tickets/Ticket/ListAll/52' });
}

async function getTicketById(ticketId) {
  return send('get', { e: `/Tickets/Ticket/${ticketId}` });
}

async function createTicket(urlObj) {
  return send('post', { e: '/Tickets/Ticket' }, { ...generateAuthentication(), ...urlObj });
}

async function deleteTicket(ticketId) {
  return send('delete', { e: `/Tickets/Ticket/${ticketId}` });
}

async function getAllPostsForTicket(ticketId) {
  return send('get', { e: `/Tickets/TicketPost/ListAll/${ticketId}` });
}

async function getPostById(ticketId, postId) {
  return send('get', { e: `/Tickets/TicketPost/${ticketId}/${postId}` });
}

async function createPost(urlObj) {
  return send('post', { e: '/Tickets/TicketPost' }, { ...generateAuthentication(), ...urlObj });
}

async function deletePost(ticketId, postId) {
  return send('delete', { e: `/Tickets/TicketPost/${ticketId}/${postId}` });
}

module.exports.getTestAPI = getTestAPI;
module.exports.getAllEDPubTickets = getAllEDPubTickets;
module.exports.getTicketById = getTicketById;
module.exports.createTicket = createTicket;
module.exports.deleteTicket = deleteTicket;
module.exports.getAllPostsForTicket = getAllPostsForTicket;
module.exports.getPostById = getPostById;
module.exports.createPost = createPost;
module.exports.deletePost = deletePost;
