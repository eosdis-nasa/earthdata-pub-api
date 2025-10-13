const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
  S3Client, ListObjectsCommand, GetObjectCommand, HeadObjectCommand
} = require('@aws-sdk/client-s3');
const path = require('path');

const db = require('database-util');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

const cueAPIToken = process.env.CUE_API_TOKEN;
const cueRootUrl = process.env.CUE_ROOT_URL;
const cueCollection = process.env.CUE_COLLECTION;

const multipartUploadLimitBytes = process.env.MULTIPART_UPLOAD_LIMIT_BYTES;

const useCUEUpload = process.env.USE_CUE_UPLOAD;

const categoryEnums = ['documentation', 'sample'];

async function legacyGenerateUploadUrl(params) {
  const { key, checksumValue, fileType } = params;
  const checksumAlgo = 'SHA256';
  if (!fileType) return ({ error: 'invalid file type' });
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

async function cuePostQuery(params) {
  const { endpoint, payload } = params;
  const response = await fetch(`${cueRootUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cueAPIToken}`
    },
    body: JSON.stringify(payload)
  });
  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-console
    console.log(responseText);
    return ({ error: 'Error parsing CUE API response.' });
  }
}

async function generateUploadUrl(params) {
  if (useCUEUpload?.toLowerCase?.() === 'false') return legacyGenerateUploadUrl(params);
  const {
    key, checksumValue, fileType, fileSize
  } = params;
  if (!fileType) return ({ error: 'invalid file type' });
  try {
    const response = await cuePostQuery({
      endpoint: '/v2/upload/prepare-single',
      payload: {
        collection_name: cueCollection,
        file_name: path.basename(key),
        file_size_bytes: fileSize,
        checksum: checksumValue,
        collection_path: path.dirname(key),
        content_type: fileType
      }
    });
    return {
      ...(response.error ? {} : { collection_path: path.dirname(key) }),
      ...response
    };
  } catch (err) {
    console.error(err);
    return ({ error: 'Error getting upload url' });
  }
}

async function getPostUrlMethod(event, user) {
  const {
    file_name: fileName,
    file_type: fileType,
    checksum_value: checksumValue,
    file_size_bytes: fileSize
  } = event;
  const { file_category: fileCategory } = event;
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);

  if (!fileCategory || !categoryEnums.includes(fileCategory)) {
    return ({ error: 'Invalid file category' });
  }

  if (submissionId) {
    const {
      daac_id: daacId,
      contributor_ids: contributorIds
    } = await db.submission.findById({ id: submissionId, user_id: userInfo.id });
    if (!contributorIds) return ({ error: 'Submission not found' });

    const userDaacs = groupIds.length > 0 ? await db.daac.getIds({ group_ids: groupIds }) : [];
    const userDaacIds = userDaacs.map((daac) => daac.id);

    if (contributorIds.includes(user)
      || userInfo.user_privileges.includes('ADMIN')
      || userDaacIds.includes(daacId)
    ) {
      return generateUploadUrl({
        key: `${submissionId}/${fileCategory}/${user}/${fileName}`,
        checksumValue,
        fileType,
        fileCategory,
        fileSize
      });
    }
  }
  return generateUploadUrl({
    key: `${fileCategory}/${user}/${fileName}`,
    checksumValue,
    fileType,
    fileCategory,
    fileSize
  });
}

async function getGroupUploadUrlMethod(event, user) {
  const {
    file_name: fileName,
    file_type: fileType,
    checksum_value: checksumValue,
    prefix,
    file_size_bytes: fileSize
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
    fileType,
    fileSize
  });
}

async function getAttachmentUploadUrlMethod(event, user) {
  const {
    file_name: fileName,
    file_type: fileType,
    checksum_value: checksumValue,
    conversation_id: conversationId,
    file_size_bytes: fileSize
  } = event;
  const userInfo = await db.user.findById({ id: user });

  if (!userInfo.user_privileges.includes('ADMIN') && !userInfo.user_privileges.includes('NOTE_REPLY')) {
    return ({ error: 'Not Authorized' });
  }
  const key = `drafts/${conversationId}/${user}/${fileName}`;
  return generateUploadUrl({
    key,
    checksumValue,
    fileType,
    fileSize
  });
}

async function getUploadStepUrlMethod(event, user) {
  const {
    file_name: fileName,
    file_type: fileType,
    checksum_value: checksumValue,
    file_category: fileCategory,
    destination: uploadDestination,
    submission_id: submissionId,
    file_size_bytes: fileSize
  } = event;

  const key = `${uploadDestination.replace(/^\/?/, '').replace(/\/?$/, '')}/${submissionId}/${fileCategory}/${user}/${fileName}`;
  return generateUploadUrl({
    key,
    checksumValue,
    fileType,
    fileSize
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
  const userDaacs = groupIds.length > 0 ? await db.daac.getIds({ group_ids: groupIds }) : [];
  const userDaacIds = userDaacs.map((daac) => daac.id);

  const {
    daac_id: daacId,
    contributor_ids: contributorIds
  } = await db.submission.findById({ id: submissionId, user_id: userInfo.id });

  if (contributorIds.includes(user)
    || userInfo.user_privileges.includes('ADMIN')
    || userDaacIds.includes(daacId)
  ) {
    const s3Client = new S3Client({ region });
    const command = new ListObjectsCommand({ Bucket: ingestBucket, Prefix: `${submissionId}` });

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

async function listStepFilesMethod(event, user) {
  let rawResponse;
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const {
    contributor_ids: contributorIds,
    step_data: stepData
  } = await db.submission.findById({ id: submissionId, user_id: userInfo.id });

  const {
    upload_destination: prefix
  } = await db.upload.findUploadStepById({ id: stepData.upload_step_id });

  if (contributorIds.includes(user)
    || userInfo.user_privileges.includes('ADMIN')
  ) {
    if (prefix) {
      const s3Client = new S3Client({ region });
      const command = new ListObjectsCommand({ Bucket: ingestBucket, Prefix: `${prefix}/${submissionId}` });

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
    return ([]);
  }
  return ({ error: 'Not Authorized' });
}

async function getAttachmentDownloadUrlMethod(event, user, s3Client) {
  // TODO - Write a proper query to check if user has permissions to view note instead of relying
  // on larger find query
  const noteId = event.key.split('/')[1];
  const { id } = await db.note.findById({ id: noteId, user_id: user });
  if (id) {
    const payload = {
      Bucket: ingestBucket,
      Key: event.key
    };

    try {
      const command = new GetObjectCommand(payload);
      return getSignedUrl(s3Client, command, { expiresIn: 60 });
    } catch (err) {
      console.error(err);
      return ({ error: 'Failed to download' });
    }
  }
  return ({ error: 'Not Authorized' });
}

async function getDownloadUrlMethod(event, user) {
  const { key } = event;
  const s3Client = new S3Client({
    region
  });

  if (key.split('/')[0] === 'attachments') return getAttachmentDownloadUrlMethod(event, user, s3Client);

  const submissionId = key.split('/')[0];
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);
  const userDaacs = groupIds.length > 0 ? await db.daac.getIds({ group_ids: groupIds }) : [];
  const userDaacIds = userDaacs.map((daac) => daac.id);

  const {
    daac_id: daacId
  } = await db.submission.findById({ id: submissionId, user_id: userInfo.id });

  if (userInfo.user_privileges.includes('ADMIN')
    || userDaacIds.includes(daacId)
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

async function getUploadStepMethod(event) {
  const { upload_step_id: uploadStepId } = event;
  return db.upload.findUploadStepById({ id: uploadStepId });
}

async function completeUploadMethod(event) {
  const {
    file_size_bytes: fileSize,
    upload_id: uploadId,
    etags
  } = event;

  const commonPayload = {
    file_id: event.file_id,
    collection_name: cueCollection,
    file_name: event.file_name,
    collection_path: event.collection_path,
    content_type: event.content_type,
    checksum: event.checksum_value
  };

  if (Number(fileSize) < 0) return { error: 'Invalid file_size_types size.' };
  let response;
  if (Number(fileSize) > Number(multipartUploadLimitBytes)) {
    // Use multipart upload endpoint
    response = await cuePostQuery({
      endpoint: '/v2/upload/multipart/complete',
      payload: {
        ...commonPayload,
        ...{
          upload_id: uploadId,
          parts: etags,
          final_file_size: fileSize
        }
      }
    });
  } else {
    if (etags.length > 1) return { error: 'Too many objects provided within etag array for single file upload.' };
    // Use single part upload endpoint
    response = await cuePostQuery({
      endpoint: '/v2/upload/complete-single',
      payload: {
        ...commonPayload,
        ...{
          file_size_bytes: fileSize,
          // Single file upload should only contain 1 object within the etag array
          s3_etag: etags[0].Etag
        }
      }
    });
  }
  return response;
}

async function startMultipartUploadMethod(event) {
  delete event.operation;
  delete event.context;
  let response;
  try {
    response = await cuePostQuery({
      endpoint: '/v2/upload/multipart/start',
      payload: {
        ...event,
        ...{
          collection_name: cueCollection
        }
      }
    });
  } catch (err) {
    console.error({ error: 'Error starting multipart upload.' });
  }
  return response;
}

const operations = {
  getPostUrl: getPostUrlMethod,
  listFiles: listFilesMethod,
  listStepFiles: listStepFilesMethod,
  getDownloadUrl: getDownloadUrlMethod,
  getGroupUploadUrl: getGroupUploadUrlMethod,
  getAttachmentUploadUrl: getAttachmentUploadUrlMethod,
  getUploadStepUrl: getUploadStepUrlMethod,
  getUploadStep: getUploadStepMethod,
  completeUpload: completeUploadMethod,
  startMultipartUpload: startMultipartUploadMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
