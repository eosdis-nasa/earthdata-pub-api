const getAssignedDaacCodeTemplate = (params, envUrl) => {
  const { user, eventMessage } = params;
  const text = `Hello ${user.name},\n\nYour Data Submission Request for ${eventMessage.submission_name} has been approved for publication at the following DAAC(s).\n\n${eventMessage.assigned_daacs.map(e => e.daac_name).join('\n')}\n\nIf you have been assigned to more than one DAAC, the DAACs will contact you to discuss which products go to which DAAC.\n\nWhen the data products covered under this Accession Request are ready, you will need to submit a separate Data Publication Request for each product. You can do this via Earthdata Pub: ${envUrl}/getting_started#publication.\n\nYou will need to enter the access code(s) below each time you submit a Data Publication Request.\n\n${eventMessage.assigned_daacs.map(e => `${e.daac_name}: ${e.code}`).join('\n')}\n\nAnyone submitting a Data Publication Request will need both the DPR code and an Earthdata Pub account. If you would like to delegate this duty, please provide the code(s) to the person(s) submitting requests on your behalf and ensure they request an account: ${envUrl}/getting_started#account.\n\nView and track all of your Earthdata Pub requests in the Earthdata Pub Dashboard: ${envUrl}/dashboard.\n`;
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
                    <p>If you have been assigned to more than one DAAC, the DAACs will contact you to discuss which products go to which DAAC.</p>
                    <br/>
                    <p>When the data products covered under this Accession Request are ready, you will need to submit a separate Data Publication Request for each product. You can do this via <a style="text-align: left;" href="${envUrl}/getting_started#publication" aria-label="Getting Started">Earthdata Pub</a>. You will need to enter the access code(s) below each time you submit a Data Publication Request.</p>
                    <br/>
                    ${eventMessage.assigned_daacs.map((element) => `<p>${element.daac_name}: ${element.code}</p>`).join('\n')}
                    <br/>
                    <p>Anyone submitting a Data Publication Request will need both the DPR code and an Earthdata Pub account. If you would like to delegate this duty, please provide the code(s) to the person(s) submitting Data Publication Request(s) on your behalf and ensure that they request an <a style="text-align: left;" href="${envUrl}/getting_started#account" aria-label="Getting Started">Earthdata Pub account</a> as soon as possible. </p>
                    <br/>
                    <br/>
                    <p>View and track all of your Earthdata Pub requests in the <a style="text-align: left;" href="${envUrl}/dashboard" aria-label="Getting Started">Earthdata Pub Dashboard</a>.</p>
                </td>
            </tr>
        </table>
    </body>
    </html> 
    `;
  return [text, html];
};
module.exports.getAssignedDaacCodeTemplate = getAssignedDaacCodeTemplate;
