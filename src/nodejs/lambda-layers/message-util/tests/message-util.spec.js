const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { Readable } = require('stream');
// eslint-disable-next-line
const { mockClient } = require('aws-sdk-client-mock');
// eslint-disable-next-line
const { sdkStreamMixin } = require('@smithy/util-stream');
const MessageUtil = require('../src/message-util.js');

jest.mock('../src/create-email', () => ({
  createEmailHtml: jest.fn(() => ['Hello World', '<html><body><h1>Hello World</h1></body></html>'])
}));

let mockS3Client;
let smMock;
let mockSESv2Client;

describe('Message Util', () => {
  beforeEach(() => {
    mockS3Client = mockClient(S3Client);
    smMock = mockClient(SecretsManagerClient);
    mockSESv2Client = mockClient(SESv2Client);
  });

  it('should import without error', () => {
    expect(MessageUtil).toBeTruthy();
  });

  it('should send email without error', async () => {
    const stream = new Readable();
    stream.push('hello world');
    stream.push(null); // end of stream

    // wrap the Stream with SDK mixin
    const sdkStream = sdkStreamMixin(stream);

    mockS3Client.on(GetObjectCommand).resolves({ Body: sdkStream });
    smMock.on(GetSecretValueCommand)
      .resolves({
        SecretString: JSON.stringify({ ses_access_creds: 'fake_key' })
      });

    const result = await MessageUtil.sendEmail([{ email: 'test@test.test' }], '', '');
    expect(result).toEqual({ success: true });
  });

  it('should trigger backoff on throttling', async () => {
    jest.useFakeTimers();
    jest.runAllTimersAsync();
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');

    // Mock out the S3 Client
    // Adapted from https://github.com/m-radzikowski/aws-sdk-client-mock?tab=readme-ov-file#s3-getobjectcommand
    // create Stream from string
    const stream = new Readable();
    stream.push('hello world');
    stream.push(null); // end of stream

    // wrap the Stream with SDK mixin
    const sdkStream = sdkStreamMixin(stream);

    mockS3Client.on(GetObjectCommand).resolves({ Body: sdkStream });
    smMock.on(GetSecretValueCommand)
      .resolves({
        SecretString: JSON.stringify({ ses_access_creds: 'fake_key' })
      });

    const throttlingError = new Error('Maximum sending rate exceeded');
    throttlingError.name = 'ThrottlingException';

    mockSESv2Client.on(SendEmailCommand).rejects(throttlingError);
    const logSpy = jest.spyOn(console, 'log');

    const result = await MessageUtil.sendEmail([{ email: 'test@test.test' }, { email: 'test2@test2.test' }], '', '');

    jest.useRealTimers();

    expect(logSpy).toHaveBeenCalledWith('Maximum send rate exceeded when sending email. Backing off.');
    expect(mockSetTimeout).toHaveBeenCalledTimes(6);
    // Restore original functions
    logSpy.mockRestore();
    mockSetTimeout.mockRestore();
    expect(result).toEqual({ error: '2 errors encountered in sendEmail' });
  });

  it('should trigger backoff once but complete without error', async () => {
    jest.useFakeTimers();
    jest.runAllTimersAsync();
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');

    // Mock out the S3 Client
    // Adapted from https://github.com/m-radzikowski/aws-sdk-client-mock?tab=readme-ov-file#s3-getobjectcommand
    // create Stream from string
    const stream = new Readable();
    stream.push('hello world');
    stream.push(null); // end of stream

    // wrap the Stream with SDK mixin
    const sdkStream = sdkStreamMixin(stream);

    mockS3Client.on(GetObjectCommand).resolves({ Body: sdkStream });
    smMock.on(GetSecretValueCommand)
      .resolves({
        SecretString: JSON.stringify({ ses_access_creds: 'fake_key' })
      });

    const throttlingError = new Error('Maximum sending rate exceeded');
    throttlingError.name = 'ThrottlingException';

    mockSESv2Client.on(SendEmailCommand).rejectsOnce(throttlingError).resolves({});
    const logSpy = jest.spyOn(console, 'log');

    const result = await MessageUtil.sendEmail([{ email: 'test@test.test' }], '', '');

    jest.useRealTimers();

    expect(logSpy).toHaveBeenCalledWith('Maximum send rate exceeded when sending email. Backing off.');
    expect(mockSetTimeout).toHaveBeenCalledTimes(1);
    // Restore original functions
    logSpy.mockRestore();
    mockSetTimeout.mockRestore();
    expect(result).toEqual({ success: true });
  });
});
