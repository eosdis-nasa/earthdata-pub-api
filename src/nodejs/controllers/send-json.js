function sendJson(res, body, latency = 0) {
  setTimeout(() => {
    if (body && typeof body === 'object' && !Array.isArray(body) && body.statusCode === 400) {
      res.status(400);
    }
    res.send(body);
  }, latency);
}

module.exports = { sendJson };
