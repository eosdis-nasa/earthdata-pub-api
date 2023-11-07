Integrating an Asynchronous External Service

In Earthdata Pub (EDPUB), virtually all interactions happen through passing an event message through the central SNS Topic.
EDPUB allows for users to subscribe to the central SNS to listen for certain event types to perform such common tasks as synchronizing concurrent data storage, fanning out notifications, and tracking progress of submissions on a particular workflow.

Detailed here is a step-by-step process for configuring a basic service and subscribing it to the SNS.

HTTP/S Service

Create an HTTP server using your preferred language and platform that is capable of receiving POST requests and parsing JSON. It will need to handle the initial Subscription Confirmation message (detailed below) and subsequent Notification messages (also detailed below).

Register the service with EDPUB *this part will be done manually by EDPUB admin in early versions
  The EDPUB team will need the following information about your service:
  1. Protocol (http or https)
  2. Service URL
  3. Will it use Basic or Digest Authentication in the URL
  3. Filter Policy (this describes what event types and entities to listen for)
  During registration, the service will have a unique service user assigned to it which it will use for authenticating to interact with the API.

When the subscription is first created, AWS will send the Subscription Confirmation message (example below).
To confirm the subscription, the service will need to make a GET request to the SubscribeURL included in the message. Alternatively, to prevent automatically accepting unwanted subscriptions, the service can make the URL available for someone to visit manually.

Confirming Subscription

  POST / HTTP/1.1
  x-amz-sns-message-type: SubscriptionConfirmation
  x-amz-sns-message-id: 165545c9-2a5c-472c-8df2-7ff2be2b3b1b
  x-amz-sns-topic-arn: arn:aws:sns:us-west-2:123456789012:MyTopic
  Content-Length: 1336
  Content-Type: text/plain; charset=UTF-8
  Host: myhost.example.com
  Connection: Keep-Alive
  User-Agent: Amazon Simple Notification Service Agent

  {
    "Type" : "SubscriptionConfirmation",
    "MessageId" : "165545c9-2a5c-472c-8df2-7ff2be2b3b1b",
    "Token" : "2336412f37...",
    "TopicArn" : "arn:aws:sns:us-west-2:123456789012:MyTopic",
    "Message" : "You have chosen to subscribe to the topic arn:aws:sns:us-west-2:123456789012:MyTopic.\nTo confirm the subscription, visit the SubscribeURL included in this message.",
    "SubscribeURL" : "https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:123456789012:MyTopic&Token=2336412f37...",
    "Timestamp" : "2012-04-26T20:45:04.751Z",
    "SignatureVersion" : "1",
    "Signature" : "EXAMPLEpH+DcEwjAPg8O9mY8dReBSwksfg2S7WKQcikcNKWLQjwu6A4VbeS0QHVCkhRS7fUQvi2egU3N858fiTDN6bkkOxYDVrY0Ad8L10Hs3zH81mtnPk5uvvolIC1CXGu43obcgFxeL3khZl8IKvO61GWB6jI9b5+gLPoBc1Q=",
    "SigningCertURL" : "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem"
  }

Once the subscription is confirmed, messages will be routed to the service according to the specified filtering attributes. Note in the example below the Message attribute is a JSON string and must be parsed into an object.
The event_type attribute defines what kind of event took place, the other attributes in the message will vary depending on the event_type.
An example use case is synchronizing local collection metadata systems as it is updated in EDPUB.
The service would subscribe to the "submission_metadata_update" event type, further filtering on DAAC's unique id.
An incoming message indicates a particular submission's metadata was updated, the service then makes a request to the API (https://<base-url>/metadata/<submission_id>) and updates the local system with the retrieved data.

Notification Message

POST / HTTP/1.1
x-amz-sns-message-type: Notification
x-amz-sns-message-id: 22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324
x-amz-sns-topic-arn: arn:aws:sns:us-west-2:123456789012:MyTopic
x-amz-sns-subscription-arn: arn:aws:sns:us-west-2:123456789012:MyTopic:c9135db0-26c4-47ec-8998-413945fb5a96
Content-Length: 773
Content-Type: text/plain; charset=UTF-8
Host: myhost.example.com
Connection: Keep-Alive
User-Agent: Amazon Simple Notification Service Agent

{
  "Type" : "Notification",
  "MessageId" : "22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324",
  "TopicArn" : "arn:aws:sns:us-west-2:123456789012:MyTopic",
  "Subject" : "My First Message",
  "Message" : "{/"event_type/": /"submission_metadata_update/", "/submission_id/": /"5a2e3e31-aae4-47fb-b6ab-6720dedd36e2/", /"daac_id/": /"15df4fda-ed0d-417f-9124-558fb5e5b561/"}",
  "Timestamp" : "2012-05-02T00:54:06.655Z",
  "SignatureVersion" : "1",
  "Signature" : "EXAMPLEw6JRN...",
  "SigningCertURL" : "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
  "UnsubscribeURL" : "https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:123456789012:MyTopic:c9135db0-26c4-47ec-8998-413945fb5a96"
}

Confirming Subscription Removal

POST / HTTP/1.1
x-amz-sns-message-type: UnsubscribeConfirmation
x-amz-sns-message-id: 47138184-6831-46b8-8f7c-afc488602d7d
x-amz-sns-topic-arn: arn:aws:sns:us-west-2:123456789012:MyTopic
x-amz-sns-subscription-arn: arn:aws:sns:us-west-2:123456789012:MyTopic:2bcfbf39-05c3-41de-beaa-fcfcc21c8f55
Content-Length: 1399
Content-Type: text/plain; charset=UTF-8
Host: myhost.example.com
Connection: Keep-Alive
User-Agent: Amazon Simple Notification Service Agent

{
  "Type" : "UnsubscribeConfirmation",
  "MessageId" : "47138184-6831-46b8-8f7c-afc488602d7d",
  "Token" : "2336412f37...",
  "TopicArn" : "arn:aws:sns:us-west-2:123456789012:MyTopic",
  "Message" : "You have chosen to deactivate subscription arn:aws:sns:us-west-2:123456789012:MyTopic:2bcfbf39-05c3-41de-beaa-fcfcc21c8f55.\nTo cancel this operation and restore the subscription, visit the SubscribeURL included in this message.",
  "SubscribeURL" : "https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:123456789012:MyTopic&Token=2336412f37fb6...",
  "Timestamp" : "2012-04-26T20:06:41.581Z",
  "SignatureVersion" : "1",
  "Signature" : "EXAMPLEHXgJm...",
  "SigningCertURL" : "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem"
}

Basic and Digest Authentication:
https://www.rfc-editor.org/info/rfc2617

Addition information on confirmation messages:
https://docs.aws.amazon.com/sns/latest/dg/sns-message-and-json-formats.html#http-subscription-confirmation-json

Verifying a message signature is an important consideration for production services:
https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html

Some additional information and considerations can be read here:
https://docs.aws.amazon.com/sns/latest/dg/sns-http-https-endpoint-as-subscriber.html

Generated documentation from the packaging process are stored here.

jsdoc/
  JSDoc generated static site with documentation on NodeJS modules.
apidoc/
  OpenAPI 3.0 static site with documentation on HTTP API and data models.
