const getDefaultStepPromotion = (params) => {
    const { user, eventMessage } = params;
    const text = `Hello ${user.name},\n\nThe following request has changed step in the ${eventMessage.workflow_name} workflow.\n\nRequest:\n${eventMessage.submission_name} (${eventMessage.submission_id})\n\nNew Step:\n${eventMessage.step_name}\n\nComments:\n${eventMessage.conversation_last_message}`;
    const html = `
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
                    <p>The following request to the ${eventMessage.daac_name} in Earthdata Pub has a change in status:</p>
                    <h2>Request:</h2>
                    <p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard/requests/id/${eventMessage.submission_id}" aria-label="View the request">${eventMessage.submission_name} (${eventMessage.submission_id})</a><br></p>
                    <h2>New Status:</h2>
                    <p>${eventMessage.conversation_last_message}</p>
                    <br><br>
                    <p><a style="text-align: left;" href="https://pub.earthdata.nasa.gov/dashboard" aria-label="Visit Earthdata Pub Dashboard">https://pub.earthdata.nasa.gov/dashboard</a></p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;
    return [text, html];
};
module.exports.getDefaultStepPromotion = getDefaultStepPromotion;