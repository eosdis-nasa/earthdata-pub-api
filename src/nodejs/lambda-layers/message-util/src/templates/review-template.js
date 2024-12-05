const getReviewerAddedTemplate = async (params, envUrl, xx) => {
  // Fallback Base64 image content (example provided here)
  const base64Logo = 'data:image/jpeg;base64,data:image/jpeg;base64,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'; // Use your full Base64 string

  const text = `Hello ${params.user.name},\n\nYou have been added as a reviewer to an Earthdata Pub request.\nYour review can be added at ${envUrl}/dashboard/forms/id/${params.eventMessage.formId}?requestId=${params.eventMessage.submissionId}.`;

  const html = `
    <html>
       <body style="background: white">
           <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style>
           <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
             <tr style="width:100%;background:#f8f8f8">
                 <td>
                   <table>
                     <tr>
                      <td width="60">
                        <!-- Replacing the URL with the Base64 string -->
                        <img src="${base64Logo}" alt="Logo" title="Logo" style="display:block"/>                 
                      </td>
                      <td>
                        <h4>Earthdata Pub</h4>
                      </td>
                     </tr>
                   </table>
                 </td>
                 <td align="right"><b>Reviewer Added</b>${xx}</td>
                 <td></td>
             </tr>
             <tr>
               <td colspan="2" style="padding:20px;">
                 <h1>Hello ${params.user.name},</h1><br><br>
                 <p>You have been added as a reviewer to an Earthdata Pub request.</p>
                 <p>Your review can be added at <a aria-label="Visit Earthdata Pub Request Review Page" href="${envUrl}/dashboard/forms/id/${params.eventMessage.formId}?requestId=${params.eventMessage.submissionId}">${envUrl}/dashboard/forms/id/${params.eventMessage.formId}?requestId=${params.eventMessage.submissionId}</a>.</p><br>
                 <p><a style="text-align: left;" href="${envUrl}/dashboard" aria-label="Visit Earthdata Pub Dashboard">${envUrl}/dashboard</a></p>
               </td>
             </tr>
          </table>
       </body>
     </html> 
    `;

  return [text, html];
};

module.exports.getReviewerAddedTemplate = getReviewerAddedTemplate;
