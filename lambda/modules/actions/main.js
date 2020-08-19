/**
 * Standalone methods (Actions) that are executed by the Action System. These
 * Actions can be specified as a step in a Workflow or called individually
 * through the Invoke API. Custom Actions can be added to the system through
 * the Register API.
 *
 * @module Actions
 * @see module:ActionHandler
 * @see module:Invoke
 * @see module:Register
 */

/**
 * AWS Lambda modules that are triggered by external requests routed fromAwsError
 * AWS API Gateway.
 * @namespace APIGateway
 * @see module:Dashboard
 * @see module:Information
 * @see module:Invoke
 * @see module:Notify
 * @see module:Register
 * @see module:Submission
 * @see module:Subscription
 */

/**
 * AWS Lambda modules that are triggered by event messages from an AWS SNS Topic.
 * @namespace SNS
 * @see module:NotificationHandler
 * @see module:WorkflowHandler
 */

/**
 * AWS Lambda modules that are triggered by event messages from an AWS SQS Queue.
 * @namespace SQS
 * @see module:ActionHandler
 */

/**
 * AWS Lambda Layers to expose common functionality between AWS Lambdas.
 * @namespace Layers
 * @see module:DatabaseDriver
 * @see module:MessageDriver
 */
