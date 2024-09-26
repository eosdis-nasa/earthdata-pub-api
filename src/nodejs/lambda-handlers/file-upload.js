const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
  S3Client, ListObjectsCommand, GetObjectCommand, HeadObjectCommand
} = require('@aws-sdk/client-s3');

const db = require('database-util');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function generateUploadUrl(params) {
  const {
    key,
    checksumValue,
    fileType,
    fileCategory
  } = params;
  const checksumAlgo = 'SHA256';
  const categoryEnums = ['documentation', 'sample'];
  if (!fileType) return ({ error: 'invalid file type' });
  if (!fileCategory || !categoryEnums.includes(fileCategory)) {
    return ({ error: 'Invalid file category' });
  }
  const s3Client = new S3Client({
    region
  });

  const payload = {
    Bucket: ingestBucket,
    Key: key,
    Conditions: [
      { 'x-amz-meta-checksumalgorithm': checksumAlgo },
      { 'x-amz-meta-checksumvalue': checksumValue },
      { 'x-amz-checksum-sha256': checksumValue }
    ],
    Fields: {
      'x-amz-meta-checksumalgorithm': checksumAlgo,
      'x-amz-meta-checksumvalue': checksumValue,
      'x-amz-checksum-sha256': checksumValue
    },
    Expires: 60
  };

  try {
    const resp = await createPresignedPost(s3Client, payload);
    return (resp);
  } catch (err) {
    console.error(err);
    return ({ error: 'Error generating upload url' });
  }
}

async function getPostUrlMethod(event, user) {
  const { file_name: fileName, file_type: fileType, checksum_value: checksumValue } = event;
  const { file_category: fileCategory } = event;
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);

  if (submissionId) {
    const {
      daac_id: daacId,
      contributor_ids: contributorIds
    } = await db.submission.findById({ id: submissionId });
    if (!daacId) return ({ error: 'Submission not found' });

    const userDaacs = (await db.daac.getIds({ group_ids: groupIds }))
      .map((daac) => daac.id);

    if (contributorIds.includes(user)
      || userInfo.user_privileges.includes('ADMIN')
      || userDaacs.includes(daacId)
    ) {
      return generateUploadUrl({
        key: `${daacId}/${submissionId}/${fileCategory}/${user}/${fileName}`,
        checksumValue,
        fileType,
        fileCategory
      });
    }
  }
  return generateUploadUrl({
    key: `${fileCategory}/${user}/${fileName}`,
    checksumValue,
    fileType,
    fileCategory
  });
}

async function getGroupUploadUrlMethod(event, user) {
  const {
    file_name: fileName, file_type: fileType, checksum_value: checksumValue, prefix
  } = event;
  const { group_id: groupId } = event;
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);
  const rootGroupId = '4daa6b22-f015-4ce2-8dac-8b3510004fca';

  if (!(userInfo.user_privileges.includes('ADMIN') || groupIds.includes(rootGroupId))
    && !(groupIds.includes(groupId) && userInfo.user_privileges.includes('GROUP_UPLOAD'))) {
    return ({ error: 'Not Authorized' });
  }
  const groupShortName = (await db.group.findById({ id: groupId })).short_name;
  const key = prefix ? `group/${groupShortName}/${prefix.replace(/^\/?/, '').replace(/\/?$/, '')}/${fileName}` : `group/${groupShortName}/${fileName}`;
  return generateUploadUrl({
    key,
    checksumValue,
    fileType
  });
}

async function getChecksum(key, s3Client) {
  const payload = {
    Bucket: ingestBucket,
    Key: key,
    ChecksumMode: 'ENABLED'
  };
  try {
    const command = new HeadObjectCommand(payload);
    const response = await s3Client.send(command);
    return response.ChecksumSHA256;
  } catch (err) {
    console.error(err);
    return ({ error: 'Error getting checksum' });
  }
}

function getFileCategory(s3Key) {
  const categoryRegex = /\/(?<category>documentation|sample)\//;
  const matches = s3Key.match(categoryRegex);
  if (matches) {
    return matches.groups.category;
  }

  return 'unknown';
}

async function processFile(item, s3Client) {
  const sha256Checksum = item.ChecksumAlgorithm ? (await getChecksum(item.Key, s3Client)) : null;
  const fileMetaData = {
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified,
    file_name: item.Key.split('/').pop(),
    category: getFileCategory(item.Key),
    ...(sha256Checksum && { sha256Checksum })
  };
  return fileMetaData;
}

async function listFilesMethod(event, user) {
  let rawResponse;
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);
  const userDaacs = (await db.daac.getIds({ group_ids: groupIds }))
    .map((daac) => daac.id);
  const {
    daac_id: daacId,
    contributor_ids: contributorIds
  } = await db.submission.findById({ id: submissionId });

  if (contributorIds.includes(user)
    || userInfo.user_privileges.includes('ADMIN')
    || userDaacs.includes(daacId)
  ) {
    const s3Client = new S3Client({ region });
    const command = new ListObjectsCommand({ Bucket: ingestBucket, Prefix: `${daacId}/${submissionId}` });

    try {
      rawResponse = await s3Client.send(command);
    } catch (err) {
      console.error(err);
      return ({ error: 'Error listing files' });
    }

    if (rawResponse.Contents) {
      const response = [];
      for (let i = 0; i < rawResponse.Contents.length; i += 1) {
        response.push(await processFile(rawResponse.Contents[i], s3Client));
      }
      return response;
    }
    return ([]);
  }
  return ({ error: 'Not Authorized' });
}

async function getDownloadUrlMethod(event, user) {
  const { key } = event;
  const s3Client = new S3Client({
    region
  });

  const submissionId = key.split('/')[1];
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);
  const userDaacs = (await db.daac.getIds({ group_ids: groupIds }))
    .map((daac) => daac.id);
  const {
    daac_id: daacId
  } = await db.submission.findById({ id: submissionId });

  if (userInfo.user_privileges.includes('ADMIN')
    || userDaacs.includes(daacId)
  ) {
    const payload = {
      Bucket: ingestBucket,
      Key: key
    };
    try {
      const command = new GetObjectCommand(payload);
      return getSignedUrl(s3Client, command, { expiresIn: 60 });
    } catch (err) {
      console.error(err);
      return ({ error: 'Failed to upload' });
    }
  }
  return ({ error: 'Not Authorized' });
}

const operations = {
  getPostUrl: getPostUrlMethod,
  listFiles: listFilesMethod,
  getDownloadUrl: getDownloadUrlMethod,
  getGroupUploadUrl: getGroupUploadUrlMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
