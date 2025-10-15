# message-util templates
The templates in this folder allow developers to provide additional context to messages sent via email to end users as well as control how the emails are formatted. 

> [!IMPORTANT]
> Templates in this folder are used for email purposes only and do not automatically get added to the conversations page. For ensuring that the message also gets added to the conversations page see the [notification-consumer templates README](../../../../lambda-handlers/notification-consumer/README.md)

## When to use these templates
These templates should be used when the answer to any of the following questions is "Yes".

- Does the information contained in this message need to be emailed directly to user(s)
- Does the user need information or additional context that the [notification-consumer templates](../../../../lambda-handlers/notification-consumer/templates.js) did not provide

## When to use in combination with the [notification-consumer templates](../../../../lambda-handlers/notification-consumer/templates.js)
In most cases it is desired that messages should be added to the conversations page as well as emailed directly to the user. This is achieved using a combination of notification-consumer templates and message-util templates. It is recommended to use the template strings from the notification-consumer file as part of the message-util templates in order to maintain consistency and reduce redundancy. If the answer to any of the following questions is "Yes" you should use these templates in combination with the message-util templates.

- Is the information I want to convey already covered in a notification-consumer template string
- Am I only adding email formatting / boilerplate information

## How to add a new template
1. Identify the event type that will trigger this notification
2. Create the new template file in the [templates](../templates/) directory, re-using the message from the [notification-consumer templates](../../../../lambda-handlers/notification-consumer/templates.js) if appropriate
3. Make sure to create and return both a text and html version of the message and verify that all variables needed to render the message are being passed
4. Import the new template in the [create-email.js](../create-email.js) file
5. Add the event type as a case to the switch statement in the `createEmailHtml` function and return the call to the new template