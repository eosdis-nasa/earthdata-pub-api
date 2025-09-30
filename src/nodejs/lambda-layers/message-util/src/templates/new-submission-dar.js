const getNewSubmissionDARTemplate = (params, envUrl) => {
  const newSubmissionDARText = `Hello ${params.user.name},\n\nA request has been submitted to Earthdata Pub. The submission has received the following name:\n\n${params.eventMessage.submission_name}\n\nThank you for using Earthdata Pub.`;
  const newSubmissionDARHTML = `
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
                    <p>A request has been submitted to Earthdata Pub. The submission has received the following name:</p>
                    <p><a style="text-align: left;" href="${envUrl}/dashboard/requests/id/${params.eventMessage.submission_id}" aria-label="View the request">
                    ${params.eventMessage.submission_name}</a></p>
                    <p>Thank you for using Earthdata Pub.</p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;

  return [newSubmissionDARText, newSubmissionDARHTML];
};

module.exports.getNewSubmissionDARTemplate = getNewSubmissionDARTemplate;
