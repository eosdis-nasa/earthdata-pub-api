/**
 * Lambda used to automatically backup the rds database. This
 * lambda is triggered via a CloudWatch event each day at 8AM UTC
 * (approximately 1 hour after the automated backup windows). This
 * lambda will handle a few different backup functions such as
 * copying the automated backup each day to backup any db instance
 * deletions, compress a weekly snapshot bundle and save to S3,
 * remove automated backup copies which have met their expiration
 * period (~ 1 week), export weekly snapshots to on-prem servers.
 * @module Backup
 */

const AWS = require('aws-sdk');

const EXPIRATION_IN_DAYS = 7;
const rds = new AWS.RDS();

async function describeDBSnapshots() {
  return rds.describeDBClusterSnapshots({}).promise();
}

async function backupDaily(identifier) {
  return rds.copyDBClusterSnapshot({
    SourceDBClusterSnapshotIdentifier: identifier,
    TargetDBClusterSnapshotIdentifier: identifier.replace('rds:', '')
  }).promise();
}

async function backupWeekly() {
  // TODO- Need to revisit because AWS doesn't support built in export to s3
  // for aurora postgresql db engine types.
  return {};
}

async function expireDaily(expiredSnapshots) {
  await Promise.all(expiredSnapshots.map(async (snapshot) => rds.deleteDBClusterSnapshot({
    DBClusterSnapshotIdentifier: snapshot
  }).promise()));
}

async function backupOnPrem() {
  // TODO- Implement for future
  return {};
}

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const snapshotsResponse = await describeDBSnapshots();
  const date = new Date();

  // eslint-disable-next-line
  const todaySnapshotIdentifier = snapshotsResponse.DBClusterSnapshots.find((snapshot) => {
    return JSON.stringify(snapshot.SnapshotCreateTime).includes(date.toISOString().slice(0, 10));
  }).DBClusterSnapshotIdentifier;
  await backupDaily(todaySnapshotIdentifier);

  await backupWeekly();

  // Get array of "expired" snapshots i.e. if create time < EXPIRATION_IN_DAYS in past
  const expiredSnapshotsArr = snapshotsResponse.DBClusterSnapshots.reduce((filtered, snapshot) => {
    if (new Date(snapshot.SnapshotCreateTime) < date.setDate(date.getDate() - EXPIRATION_IN_DAYS)) {
      filtered.push(snapshot.DBClusterSnapshotIdentifier);
    }
    return filtered;
  }, []);
  await expireDaily(expiredSnapshotsArr);
  await backupOnPrem();

  const response = {
    statusCode: 200,
    body: JSON.stringify('Backup Complete!')
  };
  return response;
}

exports.handler = handler;
