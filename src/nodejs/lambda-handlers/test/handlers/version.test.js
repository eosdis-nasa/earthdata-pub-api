const version = require('../../version.js');

describe('version', () => {
    it('should return the version', async () => {
        expect(await version.handler()).toEqual({response_version: 'v1', api_version: undefined});
    });
});