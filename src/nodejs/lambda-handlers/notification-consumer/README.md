# notification-consumer templates

The text values in the [templates.js](templates.js) file are used both for creating notifications within the conversations page of Earthdata Pub as well as for adding additional context to emails sent to end users. These messages are usually relatively short, providing only basic information. 

## When to use these templates
These templates should be used when the answer to any of the following questions is "Yes".

- Should the message be added to the conversations page
- Does the message provide information on an action taken by the system or user
- Is the message relatively concise

## When to use in combination with the [message-util templates](../../lambda-layers/message-util/src/templates/)
In most cases it is desired that messages should be added to the conversations page as well as emailed directly to the user. This is achieved using a combination of notification-consumer templates and message-util templates. It is recommended to use the template strings from this file as part of the message-util templates in order to maintain consistency and reduce redundancy. If the answer to any of the following questions is "Yes" you should use these templates in combination with the message-util templates.

- Does the information contained in this message need to be emailed directly to user(s)
- Is there additional context that should be sent to the user, but does not need to be included in the conversations page

## How to add a new template
1. Decide on the `event type` you want to use to trigger this notification
2. Add a new object with that event type to the templates object in [templates.js](templates.js)
3. Update the text value with whatever text you would like added to the conversations page. 
4. Ensure that the new event type is being used and that the variables needed to render the message are passed as part of the triggering event.
