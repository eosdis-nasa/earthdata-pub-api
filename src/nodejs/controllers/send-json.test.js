const { sendJson } = require('./send-json.js');

describe('sendJson', () => {
  let res;

  beforeEach(() => {
    jest.useFakeTimers();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('maps JSON statusCode 400 to HTTP 400', () => {
    const body = { error: 'Invalid sort parameter', statusCode: 400 };
    sendJson(res, body, 0);
    jest.runAllTimers();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(body);
  });

  it('does not change HTTP status for successful arrays', () => {
    const body = [{ id: '1' }];
    sendJson(res, body, 0);
    jest.runAllTimers();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(body);
  });

  it('leaves existing 503 JSON on HTTP 200', () => {
    const body = { statusCode: 503, body: 'Internal Database Error' };
    sendJson(res, body, 0);
    jest.runAllTimers();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(body);
  });
});
