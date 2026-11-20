const {
  createReferenceId, publicErrorBody, guard, ERROR_REFERENCE_ID
} = require('../error-reference');

describe('error reference', () => {
  test('id is a time plus a short id and contains no request data', () => {
    const id = createReferenceId(new Date('2026-11-09T15:13:05.123Z'));
    expect(id.startsWith('EDP-20261109T151305Z-')).toBe(true);
    expect(ERROR_REFERENCE_ID.test(id)).toBe(true);
    expect(id.includes('secret-token')).toBe(false);
  });

  test('public error body keeps the id and leaves out the message body', () => {
    const body = publicErrorBody('EDP-20261109T151305Z-A1B2C3D4');
    expect(body.referenceId).toBe('EDP-20261109T151305Z-A1B2C3D4');
    expect(body.error).toEqual({
      code: 500,
      referenceId: 'EDP-20261109T151305Z-A1B2C3D4'
    });
    expect(JSON.stringify(body).includes('secret-token')).toBe(false);
    expect(Object.keys(body.error)).toEqual(['code', 'referenceId']);
  });

  test('guard logs the same id and does not return the thrown text', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const handler = guard(async () => {
      throw new Error('form answer secret-token');
    });
    const body = await handler({ token: 'secret-token', body: { answer: 'secret-token' } });
    expect(ERROR_REFERENCE_ID.test(body.referenceId)).toBe(true);
    expect(JSON.stringify(body).includes('secret-token')).toBe(false);
    expect(error).toHaveBeenCalledWith('Earthdata Pub error', body.referenceId, 'Error');
    const logged = JSON.stringify(error.mock.calls);
    expect(logged.includes('secret-token')).toBe(false);
    error.mockRestore();
  });

  test('guard logs the action and page and drops the query string', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const handler = guard(async () => {
      throw new Error('form answer secret-token');
    });
    const body = await handler({
      resource: 'group',
      operation: 'findAll',
      page: '/groups',
      params: { token: 'secret-token' }
    });
    expect(error).toHaveBeenCalledWith(
      'Earthdata Pub error',
      body.referenceId,
      'Error',
      'group findAll',
      '/groups'
    );
    const rejected = await handler({
      resource: 'group',
      operation: 'findAll',
      page: '/groups?token=secret-token'
    });
    expect(error).toHaveBeenCalledWith(
      'Earthdata Pub error',
      rejected.referenceId,
      'Error',
      'group findAll'
    );
    const logged = JSON.stringify(error.mock.calls);
    expect(logged.includes('secret-token')).toBe(false);
    error.mockRestore();
  });

  test('a returned server failure gets an id and the database text stays out', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const handler = guard(async () => ({
      statusCode: 503,
      body: 'Internal Database Error secret-token'
    }));
    const body = await handler({ resource: 'group', operation: 'findAll', page: '/groups' });
    expect(body.error.code).toBe(500);
    expect(ERROR_REFERENCE_ID.test(body.referenceId)).toBe(true);
    expect(JSON.stringify(body).includes('secret-token')).toBe(false);
    expect(JSON.stringify(body).includes('Internal Database Error')).toBe(false);
    expect(error).toHaveBeenCalledWith(
      'Earthdata Pub error',
      body.referenceId,
      'Error',
      'group findAll',
      '/groups'
    );
    const logged = JSON.stringify(error.mock.calls);
    expect(logged.includes('secret-token')).toBe(false);
    error.mockRestore();
  });

  test('a normal handler result is returned unchanged', async () => {
    const handler = guard(async () => ({ error: 'Not Authorized', statusCode: 200 }));
    const body = await handler({});
    expect(body).toEqual({ error: 'Not Authorized', statusCode: 200 });
  });
});
