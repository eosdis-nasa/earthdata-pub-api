# message-util templates
The templates in this folder allow developers to provide additional context to messages sent via email to end users as well as control how the emails are formatted. 

> [!IMPORTANT]
> Templates in this folder are used for email purposes only and do not automatically get added to the conversations page.

## When to use these templates
These templates should be used when the answer to any of the following questions is "Yes".

- Does the information contained in this message need to be emailed directly to user(s)
- Does the user need information or additional context that the [notification-consumer templates](../../../../lambda-handlers/notification-consumer/templates.js) did not provide

## When to use in combination with the [notification-consumer templates](../../../../lambda-handlers/notification-consumer/templates.js)
In most cases it is desired that messages should be added to the conversations page as well as emailed directly to the user. This is achieved using a combination of notification-consumer templates and message-util templates. It is recommended to use the template strings from the notification-consumer file as part of the message-util templates in order to maintain consistancy and reduce redundancy. If the answer to any of the following questions is "Yes" you should use these templates in combination with the message-util templates.

- Is the information I want to convey already covered in a notification-consumer template string
- Am I only adding email formatting / boilerplate information