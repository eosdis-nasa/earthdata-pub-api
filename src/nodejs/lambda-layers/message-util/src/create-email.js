const { getNewSubmissionTemplate } = require('./templates/new-submission');

const htmlSnippets = {
  default_style: () => ({
    text: 'td h1 { margin: 0; padding: 0; font-size: 22px; }'
  }),
  title: () => ({
    text: '<h4>Earthdata Pub</h4>'
  }),
  logo: () => ({
    text: '<img src = "https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg">'
  }),
  step_change: () => ({
    text: '<b>Step Change</b>'
  }),
  greeting: (params) => ({
    text: `<h1>Hello ${params.user.name},</h1><br><br>`
  }),
  request_body: (params) => ({
    text: `<h2>Request:</h2><p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard/requests/id/${params.eventMessage.submission_id}" aria-label="View the request">${params.eventMessage.submission_name} (${params.eventMessage.submission_id})</a><br></p>`
  }),
  step_change_body1: (params) => ({
    text: `<p>The following request has changed step in the ${params.eventMessage.workflow_name} workflow.</p>`
  }),
  step_change_body2: (params) => ({
    text: `<h2>New Step:</h2><p>${params.eventMessage.step_name}</p>`
  }),
  step_change_body3: (params) => ({
    text: `<h2>Comments:</h2><p>${params.eventMessage.conversation_last_message}</p><br><br>`
  }),
  dashboard_link: () => ({
    text: '<p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard" aria-label="Visit Earthdata Pub Dashboard">https://pub.earthdata.nasa.gov/dashboard</a></p>'
  }),
  step_change_as_text: (params) => ({
    text: `Hello ${params.user.name},\n\nThe following request has changed step in the ${params.eventMessage.workflow_name} workflow.\n\nRequest:\n${params.eventMessage.submission_name} (${params.eventMessage.submission_id})\n\nNew Step:\n${params.eventMessage.step_name}\n\nComments:\n${params.eventMessage.conversation_last_message}`
  }),
  direct_message: () => ({
    text: '<p>You have received a direct message on the Earthdata Pub Dashboard.</p>'
  }),
  event_type_for_direct_message: () => ({
    text: '<b>Direct Message Sent</b>'
  }),
  direct_message_body1: (params) => ({
    text: `<h2>Comments:</h2><p>${params.eventMessage.conversation_last_message}</p><br><br>`
  }),
  direct_message_as_text: (params) => ({
    text: `Hello ${params.user.name},\n\nYou have received a direct message on the Earthdata Pub Dashboard.\n\nRequest:\n${params.eventMessage.submission_name} (${params.eventMessage.submission_id})\n\nComments:\n${params.eventMessage.conversation_last_message}`
  })
};

const createEmailHtml = async (params) => {
  const style = htmlSnippets.default_style().text;
  const logo = htmlSnippets.logo().text;
  const title = htmlSnippets.title().text;
  const greeting = htmlSnippets.greeting(params).text;
  const requestBody = htmlSnippets.request_body(params).text;
  const dashboardLink = htmlSnippets.dashboard_link().text;

  let stepChange;
  let stepChangeBody1;
  let stepChangeBody2;
  let stepChangeBody3;
  let stepChangeAsText;
  let eventTypeForDirectMessage;
  let directMessage;
  let directMessageBody1;
  let directMessageAsText;

  if (params.eventMessage.event_type.match(/direct_message/gi)) {
    eventTypeForDirectMessage = htmlSnippets.event_type_for_direct_message().text;
    directMessage = htmlSnippets.direct_message().text;
    directMessageBody1 = htmlSnippets.direct_message_body1(params).text;
    directMessageAsText = htmlSnippets.direct_message_as_text(params).text;
  } else if (params.eventMessage.event_type.match(/request_initialized/gi)) {
    return getNewSubmissionTemplate(params);
  } else {
    stepChange = htmlSnippets.step_change().text;
    stepChangeBody1 = htmlSnippets.step_change_body1(params).text;
    stepChangeBody2 = htmlSnippets.step_change_body2(params).text;
    stepChangeBody3 = htmlSnippets.step_change_body3(params).text;
    stepChangeAsText = htmlSnippets.step_change_as_text(params).text;
  }
  const HTML = `
    <html>
      <body>
          <style>${style || ''}</style>
          <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
            <tr style="width:100%;background:#f8f8f8">
                <td>
                  <table>
                    <tr>
                      <td width="60">${logo || ''}</td>
                      <td>${title || ''}</td>
                    </tr>
                  </table>
                </td>
                <td align="right">${stepChange || eventTypeForDirectMessage || ''}</td>
                <td></td>
            </tr>
            <tr>
              <td colspan="2" style="padding:20px;">
                ${greeting || ''}
                ${stepChangeBody1 || directMessage || ''}
                ${requestBody || ''}
                ${stepChangeBody2 || directMessageBody1 || ''}
                ${stepChangeBody3 || ''}
                ${dashboardLink || ''}
              </td>
            </tr>
          </table>
      </body>
    </html> 
  `;
  return [stepChangeAsText || directMessageAsText, HTML];
};

module.exports.createEmailHtml = createEmailHtml;
