const db = require('database-util');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fileUpload = require('../../file-upload.js');

jest.mock('@aws-sdk/client-s3', () => {
  class mockS3Client {
    send() {
      return {
        Contents: [{
          Key: '/fake/path/documentation/FakeS3Key.txt',
          LastModified: 'fake_last_modified_string',
          Size: 1234,
          ChecksumAlgorithm: 'SHA256'
        }]
      };
    }
  }
  return {
    ...jest.requireActual('@aws-sdk/client-s3'),
    S3Client: mockS3Client
  };
});
jest.mock('@aws-sdk/s3-request-presigner');

jest.mock('database-util', () => jest.fn());
db.user = jest.fn();
db.user.findById = jest.fn();
db.daac = jest.fn();
db.daac.getIds = jest.fn();
db.submission = jest.fn();
db.submission.findById = jest.fn();
db.group = jest.fn();
db.group.findById = jest.fn();
db.upload = jest.fn();
db.upload.findUploadStepById = jest.fn();
db.submission.getTempUploadFiles = jest.fn();
db.submission.deleteTempUploadFilesByIds = jest.fn().mockResolvedValue({});
db.note = jest.fn();
db.note.readConversation = jest.fn();

describe('file-upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  db.user.findById.mockReturnValue({
    user_groups: [{ id: 'daac_id' }],
    user_privileges: ['ADMIN']
  });

  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    if (url === 'https://fake-cue-url.com/v2/upload/prepare-single') {
      return (new Response(JSON.stringify({
        file_id: 'file_id',
        presigned_url: 'https://s3-bucket.s3.amazonaws.com/fake'
      })));
    } if (url === 'https://fake-cue-url.com/v2/upload/multipart/complete' || url === 'https://fake-cue-url.com/v2/upload/complete-single') {
      return (new Response(JSON.stringify({
        file_id: 'file_id',
        status: 'unscanned',
        message: 'upload_message'
      })));
    } if (url === 'https://fake-cue-url.com/v2/upload/multipart/start') {
      return (new Response(JSON.stringify({
        file_id: 'file_id',
        upload_id: 'upload_id'
      })));
    } if (url === 'https://fake-cue-url.com/v2/upload/multipart/get-part-url') {
      return new Response(JSON.stringify({
        presigned_url: 'https://s3-bucket.s3.amazonaws.com/fake-part-upload'
      }));
    }
    return (new Response(JSON.stringify({ error: 'URL not mocked in test.' })));
  });

  const expectUploadResponse = expect.objectContaining({
    file_id: expect.any(String),
    upload_id: expect.any(String),
    collection_path: expect.any(String)
  });

  const expectCompleteResponse = expect.objectContaining({
    file_id: expect.any(String),
    status: expect.any(String),
    message: expect.any(String)
  });

  it('should generate an upload url', async () => {
    const payload = {
      file_name: 'test.txt',
      file_type: 'text/plain',
      checksum_value: '1234567890',
      submission_id: 'some_id',
      file_category: 'sample',
      context: { user_id: 'user_id' },
      operation: 'getUrl',
      upload_type: 'form'
    };
    db.submission.findById.mockReturnValueOnce({
      daac_id: 'daac_id',
      contributor_ids: ['contributor_id']
    });
    db.daac.getIds.mockReturnValueOnce([{ id: 'daac_id' }]);
    const response = await fileUpload.handler(payload);
    expect(response).toEqual(expectUploadResponse);
  });
  it('should generate an error when trying to create a form upload url with no submission id', async () => {
    const payload = {
      file_name: 'test.txt',
      file_type: 'text/plain',
      checksum_value: '1234567890',
      file_category: 'documentation',
      context: { user_id: 'user_id' },
      operation: 'getUrl',
      upload_type: 'form'
    };
    const response = await fileUpload.handler(payload);
    expect(response).toEqual({ error: 'Not Implemented' });
  });
  it('should generate a group upload url with no prefix', async () => {
    const payload = {
      file_name: 'test.txt',
      file_type: 'text/plain',
      checksum_value: '1234567890',
      context: { user_id: 'user_id' },
      operation: 'getUrl',
      upload_type: 'group',
      group_id: 'daac_id'
    };
    db.group.findById.mockReturnValueOnce({
      short_name: 'daac_name'
    });
    const response = await fileUpload.handler(payload);
    expect(response).toEqual(expectUploadResponse);
  });
  it('should generate an attachment url', async () => {
    const payload = {
      file_name: 'test.txt',
      file_type: 'text/plain',
      checksum_value: '1234567890',
      conversation_id: '342ba8f5-ea87-4ef4-abf0-8eb0f924115b',
      file_size_bytes: 1234,
      context: { user_id: 'user_id' },
      upload_type: 'attachment',
      operation: 'getUrl'
    };
    db.note.readConversation.mockReturnValueOnce({
      id: 'conversation_id'
    });
    
    const response = await fileUpload.handler(payload);
    expect(response).toEqual(expectUploadResponse);
  });
  it('should list request files', async () => {
    const payload = {
      operation: 'listFiles',
      submission_id: '5c3d1baa-a19e-4681-9b2d-216c08762dfb',
      context: { user_id: 'user_id' }
    };
    db.submission.getTempUploadFiles.mockResolvedValueOnce([{
      file_id: 'fakeId1',
      file_name: 'tempFile.txt',
      lastmodified: '2024-01-01T00:00:00.000Z',
      size: 987
    }]);
    db.daac.getIds.mockReturnValueOnce([{ id: 'daac_id' }]);
    db.submission.findById.mockReturnValueOnce({
      daac_id: 'daac_id',
      contributor_ids: ['contributor_id']
    });
    const response = await fileUpload.handler(payload);
    expect(response).toEqual(expect.arrayContaining([
      expect.objectContaining({
        category: 'documentation',
        file_name: 'FakeS3Key.txt',
        key: '/fake/path/documentation/FakeS3Key.txt',
        lastModified: 'fake_last_modified_string',
        size: 1234
      }),
      expect.objectContaining({
        file_id: 'fakeId1',
        file_name: 'tempFile.txt',
        lastModified: '2024-01-01T00:00:00.000Z',
        size: 987
      })
    ]));
  });
  it('should list step files', async () => {
    const payload = {
      operation: 'listStepFiles',
      submission_id: '5c3d1baa-a19e-4681-9b2d-216c08762dfb',
      context: { user_id: 'user_id' }
    };
    db.daac.getIds.mockReturnValueOnce([{ id: 'daac_id' }]);
    db.submission.findById.mockReturnValueOnce({
      daac_id: 'daac_id',
      contributor_ids: ['contributor_id'],
      step_data: { upload_step_id: 'fake_id' }
    });
    db.upload.findUploadStepById.mockReturnValueOnce({ upload_destination: 'fake_upload_destination' });
    const response = await fileUpload.handler(payload);
    expect(response).toEqual([{
      category: 'documentation',
      file_name: 'FakeS3Key.txt',
      key: '/fake/path/documentation/FakeS3Key.txt',
      lastModified: 'fake_last_modified_string',
      size: 1234
    }]);
  });
  it('should generate a download url for attachments', async () => {
    const payload = {
      operation: 'getDownloadUrl',
      key: '/attachments/fake/path/file.txt',
      submission_id: '5c3d1baa-a19e-4681-9b2d-216c08762dfb',
      context: { user_id: 'user_id' }
    };
    db.submission.findById.mockReturnValueOnce({
      daac_id: 'daac_id',
      contributor_ids: ['contributor_id']
    });
    getSignedUrl.mockReturnValue('https://fake_s3_.s3.us-west-2.amazonaws.com/attachments/file.txt');
    const response = await fileUpload.handler(payload);
    expect(response).toEqual('https://fake_s3_.s3.us-west-2.amazonaws.com/attachments/file.txt');
  });
  it('should generate a download url for non-attachments', async () => {
    const payload = {
      operation: 'getDownloadUrl',
      key: '/submission_id/fake/path/file.txt',
      submission_id: '5c3d1baa-a19e-4681-9b2d-216c08762dfb',
      context: { user_id: 'user_id' }
    };
    db.submission.findById.mockReturnValueOnce({
      daac_id: 'daac_id',
      contributor_ids: ['contributor_id']
    });
    db.daac.getIds.mockReturnValueOnce([{ id: 'daac_id' }]);
    getSignedUrl.mockReturnValue('https://fake_s3_.s3.us-west-2.amazonaws.com/file.txt');
    const response = await fileUpload.handler(payload);
    expect(response).toEqual('https://fake_s3_.s3.us-west-2.amazonaws.com/file.txt');
  });
  it('should complete multipart CUE upload', async () => {
    const payload = {
      operation: 'completeUpload',
      file_size_bytes: 104857601,
      upload_id: 'upload_id',
      parts: [
        { PartNumber: 1, ETag: 'abcdef123456' },
        { PartNumber: 2, ETag: 'fedcba654321' }
      ],
      context: { user_id: 'user_id' }
    };
    const response = await fileUpload.handler(payload);
    expect(response).toEqual(expectCompleteResponse);
  });
  it('should start getPartUrl', async () => {
    const payload = {
      operation: 'getPartUrl',
      file_id: 'fakeId1',
      context: { user_id: 'user_id' },
      part_number: 1
    };
    const response = await fileUpload.handler(payload);
    expect(response).toEqual(expect.objectContaining({
      presigned_url: expect.any(String)
    }));
  });
  it('should return CUE JSON parsing error', async () => {
    const payload = {
      file_name: 'test.txt',
      file_type: 'text/plain',
      checksum_value: '1234567890',
      submission_id: 'some_id',
      file_category: 'documentation',
      context: { user_id: 'user_id' },
      operation: 'getUrl',
      upload_type: 'form'
    };
    db.submission.findById.mockReturnValueOnce({
      daac_id: 'daac_id',
      contributor_ids: ['contributor_id']
    });
    db.daac.getIds.mockReturnValueOnce([{ id: 'daac_id' }]);
    jest.spyOn(global, 'fetch').mockImplementation(() => (new Response('<html>Non JSON response</html>')));
    const response = await fileUpload.handler(payload);
    expect(response).toEqual({ error: 'Error parsing CUE API response.' });
  });
});
