const getNewSubmissionTemplate = (params, envUrl) => {
  const newSubmissionText = `Hello ${params.user.name},\n\nThank you for creating a request to the ${params.eventMessage.daac_name} in Earthdata Pub. On your personal dashboard (${envUrl}/dashboard), your submission has received the following temporary name:\n\n${params.eventMessage.submission_name}\n\nPlease click on the green button on the far right of your submission's row to complete the appropriate form, which will gather information to continue your submission.\n\nThank you for using Earthdata Pub.`;
  const newSubmissionHTML = `
    <html>
    <body>
        <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style>
        <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
            <tr style="width:100%;background:#f8f8f8">
                <td><table><tr>
                    <td width="60"><img src="cid:NASALogo" alt="NASA Logo"></td>
                    <td><h4>Earthdata Pub</h4></td>
                </tr></table></td>
                <td align="right"><b>New Submission</b></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="2" style="padding:20px;">
                    <h1>Hello ${params.user.name},</h1><br>
                    <br>
                    <p>Thank you for creating a request to the ${params.eventMessage.daac_name} in Earthdata Pub.  On your personal dashboard (${envUrl}/dashboard), your submission has received the following temporary name:</p>
                    <p><a style="text-align: left;" href="${envUrl}/dashboard/requests/id/${params.eventMessage.submission_id}" aria-label="View the request">
                    ${params.eventMessage.submission_name}</a></p>
                    <p>Please click on the green button on the far right of your submission’s row to complete the appropriate form, which will gather information to continue your submission.</p>
                    <p>Thank you for using Earthdata Pub.</p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;

  return [newSubmissionText, newSubmissionHTML];
};

module.exports.getNewSubmissionTemplate = getNewSubmissionTemplate;
