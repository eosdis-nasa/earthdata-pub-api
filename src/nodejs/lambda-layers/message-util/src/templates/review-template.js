const getReviewerAddedTemplate = async (params, envUrl, xx) => {
  // Fallback Base64 image content (example provided here)
  const base64Logo = 'https://earthdatapub-dashboard-sit.s3.us-west-2.amazonaws.com/images/app/src/assets/images/nasa_test.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQXSOCK3LCCS5QZRS%2F20241206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241206T011321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGkaCXVzLXdlc3QtMiJHMEUCIF0u1G5iWT1GGEl1tNp9gVEMkcvUqiRZLysNs53b0VpAAiEA2266ByFTE%2F4p90XgK3aNAxzY9GKnmT7QMFNAbWkq16cq6AIIIhADGgwwNTA2Mjk1OTY4ODYiDHZ%2BOuARWgpIZjCTGirFAvBc6K54yqr8NckK8p5xxeHwmAePXQIbGVHtFpT2a5SclcH1EHf2oJLfELbO56R1tgDk0nipgXzfrtvYBamN2AvNYiIJr5I6GakzTc%2FtDi0OJPKFVq459Ry%2BTChOFWnvi2HFP7ldokGU4hlcX%2BAPiwbhxbz%2FbXScoMHzIg%2FCcRnhmow6OOt0%2BCCXHebr1F0GH3YpDOEkpzaokKIgQFw5FScs5nHctjAAEdwAMgyxH6fFHPNFp9%2FNcJeuMeBmyWwhsW6%2BuhR6QW8yH3jmD2iPMS3uD5QNVFOk%2FDKgLfVOvxShoH9T1iLnXU8nixbgxkD%2FQb8cZw%2BDC12QhZkvMYxR7zfG8A%2BpLiYJeMJrv4GKYO8TOioVQJ%2FSxkkcfnOKEzM0nDwOyhuCMBpfDqNab5rF8ve0pPaAhlKyIMLAH1mQqSA1LiA2YUswsJ%2FJugY6ngHWRH%2F%2F1mnrXk2qcvlfehh9tGDpVNsG6xGJR%2BAS3RZPNzJEBvGlMAfP4h1QgYiu8oGy3VbpcB2fxn7OBCgV2Tgz6qu%2FfsMZE5%2F8mT5AU6andJQZZOe1BIIX2Y3dBNa4Q6ektSYwzrAQr7tLnyu%2BhqcXeWZFZx36HodmoEiJQGmfiNDuI94tvwicfrzEHobcyRTk2CTxEv14Tf9CG7B0Zw%3D%3D&X-Amz-Signature=a652322f6fbf3f6c77f0422956cdec88c33a807c2587754e93092190b0c73ea6&X-Amz-SignedHeaders=host&x-id=GetObject';
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
