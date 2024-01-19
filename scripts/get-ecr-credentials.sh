#!/bin/bash
set -euo pipefail

ALGORITHM="AWS4-HMAC-SHA256"
REGION="us-east-1"
SERVICE="ecr"
DATE=$(date -u +"%Y%m%dT%H%M%SZ")
# DATE="20210720T181658Z"
CREDENTIAL="${AWS_ACCESS_KEY_ID}/${DATE:0:8}/$REGION/${SERVICE}/aws4_request"
SIGNEDHEADERS="content-type;host;x-amz-content-sha256;x-amz-date;x-amz-target"
PAYLOAD="{}"

function hash_hex () {
  echo -n "$1" | openssl dgst -sha256 -binary | xxd -p -c 64
}

function hmac_hex () {
  echo -n "$1" | openssl dgst -sha256 -binary -mac HMAC -macopt "hexkey:$2" | xxd -p -c 64
}

CANONICAL="POST
/

content-type:application/x-amz-json-1.1
host:${SERVICE}.${REGION}.amazonaws.com
x-amz-content-sha256:$(hash_hex "$PAYLOAD")
x-amz-date:${DATE}
x-amz-target:AmazonEC2ContainerRegistry_V20150921.GetAuthorizationToken

${SIGNEDHEADERS}
$(hash_hex "$PAYLOAD")"

SIGNABLE="${ALGORITHM}
${DATE}
${DATE:0:8}/${REGION}/${SERVICE}/aws4_request
$(hash_hex "$CANONICAL")"

SECRETKEY=$(echo -n "AWS4${AWS_SECRET_ACCESS_KEY}" | xxd -p -c 128)
DATEKEY=$(hmac_hex "${DATE:0:8}" "$SECRETKEY")
REGIONKEY=$(hmac_hex "$REGION" "$DATEKEY")
SERVICEKEY=$(hmac_hex "$SERVICE" "$REGIONKEY")
SIGNINGKEY=$(hmac_hex "aws4_request" "$SERVICEKEY")
SIGNATURE=$(hmac_hex "$SIGNABLE" "$SIGNINGKEY")

AUTHORIZATION="${ALGORITHM} Credential=${CREDENTIAL} SignedHeaders=${SIGNEDHEADERS} Signature=${SIGNATURE}"

echo "password=$(curl --silent -X POST \
-H "Authorization: ${AUTHORIZATION}" \
-H "Content-Type: application/x-amz-json-1.1" \
-H "Host: ${SERVICE}.${REGION}.amazonaws.com" \
-H "X-Amz-Content-Sha256:$(hash_hex "$PAYLOAD")" \
-H "X-Amz-Date:${DATE}" \
-H "X-Amz-Target:AmazonEC2ContainerRegistry_V20150921.GetAuthorizationToken" \
-d "$PAYLOAD" \
https://ecr.us-east-1.amazonaws.com | \
sed -n -e 's/^.*authorizationToken":"//p' | \
cut -d'"' -f1 | base64 --decode | \
sed -n -e 's/AWS://p')" > ecr-credentials
