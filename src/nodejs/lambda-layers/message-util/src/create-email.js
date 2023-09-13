const db = require('database-util');

const getHTML = async (params) => {
    if (message.event_type && templates[message.event_type]) {
        console.log('getHTML', params);
        const HTML = `
            <html>
              <body>
                  <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style>
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
    }
    return false;
};
module.exports.getHTML = getHTML;