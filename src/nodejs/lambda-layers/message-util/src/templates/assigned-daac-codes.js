const getAssignedDaacCodeTemplate = (params, envUrl) => {
  const { user, eventMessage } = params;
  const text = `Hello ${user.name},\n\nYour Data Submission Request for ${eventMessage.submission_name} has been approved for publication at the following DAAC(s).\n\n${eventMessage.assigned_daacs.map((element) => element.daac_name).join('\n')}\n\nFor each data product covered under this Submission Request, you will need to submit a Data Publication Request via Earthdata Pub. You will need to enter an access code each time you submit a Data Publication Request. If you’ve been assigned to more than one DAAC, the DAACs will contact you to discuss the allocation of data products.\n\n${eventMessage.assigned_daacs.map((element) => `${element.daac_name}: ${element.code}`).join('\n')}\n\nThe DPR code(s) can also be found in the conversations view in your EDPub workspace.\n\nAnyone submitting a Data Publication Request will need both the DPR code and an Earthdata Pub account. If you would like to delegate this duty, please provide the code(s) to the person(s) submitting Data Publication Request(s) on your behalf and ensure that they request an EDPub account as soon as possible. They can start the process at ${envUrl}/getting_started#account.`;
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
                    <br/>
                    <p>Your Data Submission Request for ${eventMessage.submission_name} has been approved for publication at the following DAAC(s).</p>
                    <br/>
                    ${eventMessage.assigned_daacs.map((element) => `<p>${element.daac_name}</p>`).join('\n')}
                    <br/>
                    <p>For each data product covered under this Submission Request, you will need to submit a Data Publication Request via Earthdata Pub. You will need to enter an access code each time you submit a Data Publication Request. If you’ve been assigned to more than one DAAC, the DAACs will contact you to discuss the allocation of data products.</p>
                    <br/>
                    ${eventMessage.assigned_daacs.map((element) => `<p>${element.daac_name}: ${element.code}</p>`).join('\n')}
                    <br/>
                    <p>The DPR code(s) can also be found in the conversations view in your EDPub workspace.</p>
                    <br/>
                    <p>Anyone submitting a Data Publication Request will need both the DPR code and an Earthdata Pub account. If you would like to delegate this duty, please provide the code(s) to the person(s) submitting Data Publication Request(s) on your behalf and ensure that they request an EDPub account as soon as possible. They can start the process <a style="text-align: left;" href="${envUrl}/getting_started#account" aria-label="Getting Started">HERE</a>.</p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;
  return [text, html];
};
module.exports.getAssignedDaacCodeTemplate = getAssignedDaacCodeTemplate;
