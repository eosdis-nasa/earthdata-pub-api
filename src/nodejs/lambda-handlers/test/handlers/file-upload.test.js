const fileUpload = require('../../file-upload.js');

const db = require('database-util');
const {
    S3Client, ListObjectsCommand, GetObjectCommand, HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');


jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-presigned-post');


jest.mock('database-util', () => jest.fn());
db.user = jest.fn();
db.user.findById = jest.fn();
db.daac = jest.fn();
db.daac.getIds = jest.fn();
db.submission = jest.fn();
db.submission.findById = jest.fn();

describe('file-upload', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should generate an upload url', async () => {
        const payload = {
            file_name: 'test.txt',
            file_type: 'text/plain',
            checksum_value: '1234567890',
            submission_id: 'some_id',
            context: {user_id: 'user_id'},
            operation: 'getPostUrl'
        };
        db.user.findById.mockReturnValueOnce({
            user_groups: [{id: 'daac_id'}],
            user_privileges: ['ADMIN']
        });
        db.submission.findById.mockReturnValueOnce({
            daac_id: 'daac_id',
            contributor_ids: ['contributor_id']
        });
        db.daac.getIds.mockReturnValueOnce([{id: 'daac_id'}]);
        createPresignedPost.mockImplementationOnce((client, payload) => {
            expect(payload).toEqual({
                Bucket: 'TEST_BUCKET',
                Key: 'daac_id/some_id/user_id/test.txt',
                Conditions: [
                    { 'x-amz-meta-checksumalgorithm': 'SHA256' },
                    { 'x-amz-meta-checksumvalue': '1234567890' },
                    { 'x-amz-checksum-sha256': '1234567890' }
                ],
                Fields: {
                    'x-amz-meta-checksumalgorithm': 'SHA256',
                    'x-amz-meta-checksumvalue': '1234567890',
                    'x-amz-checksum-sha256': '1234567890'
                },
                Expires: 60
            });
            return Promise.resolve('success');
        });
        const response = await fileUpload.handler(payload);
        expect(response).toEqual('success');
    });
    it('should generate an upload url with no submission id', async () => {
        const payload = {
            file_name: 'test.txt',
            file_type: 'text/plain',
            checksum_value: '1234567890',
            context: {user_id: 'user_id'},
            operation: 'getPostUrl'
        };
        db.user.findById.mockReturnValueOnce({
            user_groups: [{id: 'daac_id'}],
            user_privileges: ['ADMIN']
        });
        createPresignedPost.mockImplementationOnce((client, payload) => {
            expect(payload).toEqual({
                Bucket: 'TEST_BUCKET',
                Key: 'user_id/test.txt',
                Conditions: [
                    { 'x-amz-meta-checksumalgorithm': 'SHA256' },
                    { 'x-amz-meta-checksumvalue': '1234567890' },
                    { 'x-amz-checksum-sha256': '1234567890' }
                ],
                Fields: {
                    'x-amz-meta-checksumalgorithm': 'SHA256',
                    'x-amz-meta-checksumvalue': '1234567890',
                    'x-amz-checksum-sha256': '1234567890'
                },
                Expires: 60
            });
            return Promise.resolve('success');
        });
        const response = await fileUpload.handler(payload);
        expect(response).toEqual('success');
    });
    it('should generate a group upload url with no prefix', async () => {
        const payload = {
            file_name: 'test.txt',
            file_type: 'text/plain',
            checksum_value: '1234567890',
            context: {user_id: 'user_id'},
            operation: 'getGroupUploadUrl',
            group_id: 'daac_id'
        };
        db.user.findById.mockReturnValueOnce({
            user_groups: [{id: 'daac_id', short_name: 'daac_name'}],
            user_privileges: ['GROUP_UPLOAD']
        });
        createPresignedPost.mockImplementationOnce((client, payload) => {
            expect(payload).toEqual({
                Bucket: 'TEST_BUCKET',
                Key: 'group/daac_name/test.txt',
                Conditions: [
                    { 'x-amz-meta-checksumalgorithm': 'SHA256' },
                    { 'x-amz-meta-checksumvalue': '1234567890' },
                    { 'x-amz-checksum-sha256': '1234567890' }
                ],
                Fields: {
                    'x-amz-meta-checksumalgorithm': 'SHA256',
                    'x-amz-meta-checksumvalue': '1234567890',
                    'x-amz-checksum-sha256': '1234567890'
                },
                Expires: 60
            });
            return Promise.resolve('success');
        });
        const response = await fileUpload.handler(payload);
        expect(response).toEqual('success');
    });
});