const db = require('database-util');

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
        text: `<h1>Hello ${params.user.name},</h1><br>`
    }),
    step_change_body1: (params) => ({
        text: `<p>The following request has changed step in the ${params.eventMessage.workflow_name} workflow.</p>`
    }),
    step_change_body2: (params) => ({
        text: `<h2>Request:</h2><p>${params.eventMessage.submission_name} (${params.eventMessage.submission_id})<br><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard/requests/id/${params.eventMessage.submission_id}" aria-label="View the request">Go to request</a></p>`
    }),
    step_change_body3: (params) => ({
        text: `<h2>New Step:</h2><p>${params.eventMessage.step_name}</p>`
    }),
    step_change_body4: (params) => ({
        text: `<h2>Comments:</h2><p>${params.eventMessage.conversation_last_message}</p><br><br>`
    }),
    dashboard_link: () => ({
        text: '<p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard" aria-label="Visit Earthdata Pub Dashboard">https://pub.earthdata.nasa.gov/dashboard</a></p>'
    })
};

/* const createEmailBody = async (params) => {
    const style = htmlSnippets.default_style.text;
    const logo = htmlSnippets.logo.text;
    const title = htmlSnippets.title.text;
    const stepChange = htmlSnippets.step_change.text;
    const greeting = htmlSnippets.greeting.text(params);
    const stepChangeBody1 = htmlSnippets.step_change_body1.text;
    const stepChangeBody2 = htmlSnippets.step_change_body2.text;
    const stepChangeBody3 = htmlSnippets.step_change_body3.text;
    const stepChangeBody4 = htmlSnippets.step_change_body4.text;
    const dashboardLink = htmlSnippets.dashboard_link.text;
    const HTML = `
        <html>
            <body>
                <style>${style || null}</style>
                <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
                  <tr style="width:100%;background:#f8f8f8">
                      <td>
                        <table>
                          <tr>
                            <td width="60">${logo || null}</td>
                            <td>${title || null}</td>
                          </tr>
                        </table>
                      </td>
                      <td align="right">${stepChange || null}</td>
                      <td></td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding:20px;">
                      ${greeting || null}
                      <br>
                      ${stepChangeBody1 || null}
                      ${stepChangeBody2 || null}
                      ${stepChangeBody3 || null}
                      ${stepChangeBody4 || null}
                      ${dashboardLink || null}
                    </td>
                  </tr>
                </table>
            </body>
        </html> 
    `;
    return HTML;
}; */


const createEmailBody = async (params) => {
    console.log('getHTML', params);
    // [{ email: 'broughtonkk@ornl.gov', name: 'Kimberly Broughton' }]
    const HTML = `
        <html>
            <body>
                <style></style>
                <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
                    <tr style="width:100%;background:#f8f8f8">
                        <td><table><tr>
                            <td width="60"><img src="https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg"></td>
                            <td><h4>Earthdata Pub</h4></td>
                        </tr></table></td>
                        <td align="right"><b>Step Change</b></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:20px;">
                            <h1>Hello ${user.name},</h1><br>
                            <br>
                            <p>The following request has changed step in the ${eventMessage.workflow_name} workflow.</p>
                            <h2>Request:</h2>
                            <p>${eventMessage.submission_name} (${eventMessage.submission_id})<br>
                            <a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard/requests/id/${eventMessage.submission_id}" aria-label="View the request">Go to request</a></p>
                            <h2>New Step:</h2>
                            <p>${eventMessage.step_name}</p>
                            <h2>Comments:</h2> 
                            <p>${eventMessage.conversation_last_message}</p>
                            <br><br>
                            <p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard" aria-label="Visit Earthdata Pub Dashboard">https://pub.earthdata.nasa.gov/dashboard</a></p>
                        </td>
                    </tr>
                </table>
            </body>
        </html> 
    `
    return HTML
};

module.exports.createEmailBody = createEmailBody;
module.exports.htmlSnippets = htmlSnippets;