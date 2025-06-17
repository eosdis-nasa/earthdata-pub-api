const MessageUtil = require('../src/message-util.js');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const { mockClient } = require('aws-sdk-client-mock');
const {sdkStreamMixin} = require('@smithy/util-stream');
const {Readable} = require('stream');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

jest.mock('../src/create-email', () => ({
      createEmailHtml: jest.fn(() => ['Hello World', '<html><body><h1>Hello World</h1></body></html>']),
    }));

const mockS3Client = mockClient(S3Client);
const smMock = mockClient(SecretsManagerClient);
const mockSESv2Client = mockClient(SESv2Client)


describe('Message Util', () => {
  describe('Message Util', () => {
    it('should import without error', () => {
      expect(MessageUtil).toBeTruthy();
    });

    it('should send email without error',  async () => {
      const stream = new Readable();
      stream.push('hello world');
      stream.push(null); // end of stream

      // wrap the Stream with SDK mixin
      const sdkStream = sdkStreamMixin(stream);

      mockS3Client.on(GetObjectCommand).resolves({Body: sdkStream});
      smMock.on(GetSecretValueCommand)
        .resolves({
            SecretString: JSON.stringify({ses_access_creds: 'fake_key'}),
        });

      const result = await MessageUtil.sendEmail([{ email: 'test@test.test' }], '', '');
      expect(result).toEqual({ "success": true });
    })

    it('should trigger backoff on throttling',  async () => {
      // jest.useFakeTimers();
      // const mockSetTimeout = jest.spyOn(global, 'setTimeout');
      
      // Mock out the S3 Client
      // Adapted from https://github.com/m-radzikowski/aws-sdk-client-mock?tab=readme-ov-file#s3-getobjectcommand
      // create Stream from string
      const stream = new Readable();
      stream.push('hello world');
      stream.push(null); // end of stream

      // wrap the Stream with SDK mixin
      const sdkStream = sdkStreamMixin(stream);

      mockS3Client.on(GetObjectCommand).resolves({Body: sdkStream});
      smMock.on(GetSecretValueCommand)
        .resolves({
            SecretString: JSON.stringify({ses_access_creds: 'fake_key'}),
        });

      const throttlingError = new Error('Maximum sending rate exceeded');
      throttlingError.name = 'ThrottlingException';

      mockSESv2Client.on(SendEmailCommand).rejects(throttlingError);
      const logSpy = jest.spyOn(console, 'log');

      await MessageUtil.sendEmail([{ email: 'test@test.test' }], '', '');
      // Fast-forward until all timers have been executed
      // jest.advanceTimersByTime(500);
  
      expect(logSpy).toHaveBeenCalledWith('Maximum send rate exceeded when sending email. Backing off.');
      logSpy.mockRestore(); // Restore original function
      // expect(mockSetTimeout).toHaveBeenCalledTimes(3);
    }, 120 * 1000)
  });
});
