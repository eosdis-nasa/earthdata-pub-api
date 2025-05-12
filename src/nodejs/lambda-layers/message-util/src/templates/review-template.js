const formObj = {
  '6c544723-241c-4896-a38c-adbc0a364293': 'Data Evaluation Request',
  '19025579-99ca-4344-8610-704dae626343': 'Data Publication Request'
};

const getReviewerAddedTemplate = (params, envUrl) => {
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
                       <td width="60"><img src="cid:NASALogo" alt="NASA Logo"></td>
                       <td><h4>Earthdata Pub</h4></td>
                     </tr>
                   </table>
                 </td>
                 <td align="right"><b>Reviewer Added</b></td>
                 <td></td>
             </tr>
             <tr>
               <td colspan="2" style="padding:20px;">
                 <h1>Hello ${params.user.name},</h1><br><br>
                 <p>${params.eventMessage.submitted_by_name} has requested that you review a ${formObj[params.eventMessage.formId]} submitted via Earthdata Pub.
                 Please access the submission at <a aria-label="Visit Earthdata Pub Request Review Page" href="${envUrl}/dashboard/forms/id/${params.eventMessage.formId}?requestId=${params.eventMessage.submissionId}">${envUrl}/dashboard/forms/id/${params.eventMessage.formId}?requestId=${params.eventMessage.submissionId}</a>.
                 Specific review instructions (if any) are viewable in the comments section at the bottom of the ${formObj[params.eventMessage.formId]} page. Please note that any comments you leave in the form are viewable by NASA staff, DAAC User Working Group members, and the data producer who submitted the request.</p><br>
                 <p>Thank you.</p><br>
                 <br>
                 <h3>Dashboard:</h3>
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
