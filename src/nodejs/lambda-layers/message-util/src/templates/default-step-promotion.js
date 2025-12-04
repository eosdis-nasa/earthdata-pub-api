const getDefaultStepPromotion = (params, envUrl) => {
  const { user, eventMessage } = params;
  const text = `Hello ${user.name},\n\nThe following request in Earthdata Pub has a change in status:\n\nRequest:\n${eventMessage.submission_name}\n\nNew Status:\n${eventMessage.conversation_last_message}\n\nView and track all of your Earthdata Pub requests in the Earthdata Pub Dashboard: ${envUrl}/dashboard\n`;
  const html = `
    <html>
    <body>
        <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style>
        <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
            <tr style="width:100%;background:#f8f8f8">
                <td><table><tr>
                    <td width="60"><img src="cid:NASALogo" alt="NASA Logo"></td>
                    <td><h4>Earthdata Pub</h4></td>
                </tr></table></td>
                <td align="right"><b>Step Change</b></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="2" style="padding:20px;">
                    <h1>Hello ${user.name},</h1><br>
                    <br>
                    <p>The following request in Earthdata Pub has a change in status:</p>
                    <h2>Request:</h2>
                    <p><a style="text-align: left;" href="${envUrl}/dashboard/requests/id/${eventMessage.submission_id}" aria-label="View the request">${eventMessage.submission_name}</a><br></p>
                    <h2>New Status:</h2>
                    <p>${eventMessage.conversation_last_message}</p>
                    <br><br>
                    <p>View and track all of your Earthdata Pub requests in the <a style="text-align: left;" href="${envUrl}/dashboard" aria-label="Getting Started">Earthdata Pub Dashboard</a>.</p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;
  return [text, html];
};
module.exports.getDefaultStepPromotion = getDefaultStepPromotion;
