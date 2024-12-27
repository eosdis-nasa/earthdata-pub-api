const getAssignedDaacCodeTemplate = (params, envUrl) => {
  const { user, eventMessage } = params;
  const text = `Hello ${user.name},\n\nThe ${eventMessage.submission_name} accession request has been assigned to the following DAAC(s) with the corresponding publication token(s):\n\n${eventMessage.assigned_daacs.map((element) => `${element.daac_name}: ${element.code}`).join('\n')}\n\nThese tokens can now be used to initiate a new publication request for the corresponding DAAC which will begin the publication workflow for the assigned DAAC.`;
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
                <td align="right"><b>Code Distribution</b></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="2" style="padding:20px;">
                    <h1>Hello ${user.name},</h1><br>
                    <br>
                    <p>The ${eventMessage.submission_name} accession request has been assigned to the following DAAC(s) with the corresponding publication token(s):</p>
                    ${eventMessage.assigned_daacs.map((element) => `<p>${element.daac_name}: ${element.code}</p>`).join('\n')}
                    <p>These tokens can now be used to initiate a new publication request for the corresponding DAAC which will begin the publication workflow for the assigned DAAC.</p>
                    <p><a style="text-align: left;" href="${envUrl}/dashboard" aria-label="Visit Earthdata Pub Dashboard">${envUrl}/dashboard</a></p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;
  return [text, html];
};
module.exports.getAssignedDaacCodeTemplate = getAssignedDaacCodeTemplate;
