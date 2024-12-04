const getReviewerAddedTemplate = (params, envUrl, svgDataUri) => {
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
  <img 
    src="data:image/png;base64,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"
    alt="Earthdata Pub Logo"
  >
</td>
<h4>Earthdata Pub</h4></td>
                     </tr>
                   </table>
                 </td>
                 <td align="right"><b>Reviewer Added ${svgDataUri}</b></td>
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
