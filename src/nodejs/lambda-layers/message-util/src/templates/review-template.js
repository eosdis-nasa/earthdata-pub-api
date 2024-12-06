const getReviewerAddedTemplate = async (params, envUrl, xx) => {
  // Fallback Base64 image content (example provided here)
  const base64Logo = 'https://earthdatapub-dashboard-sit.s3.us-west-2.amazonaws.com/images/app/src/assets/images/nasa_test.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQXSOCK3LERGUXYXW%2F20241206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241206T025531Z&X-Amz-Expires=216000&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIAmOtOdT3Wk8p2Jy5ABKzK31E5noupcXudGcd2K8jbuVAiEAzgd9K64pZa%2Fy6Tp9vQTR6p5qnJmP9xb81mP7fi0o7jcq6AIIJBADGgwwNTA2Mjk1OTY4ODYiDJrMHHRd9TpCDdmw3CrFAlGD808LGe4rXyqPReBOtsU8rXspiBJceFaXGzjy6OJU4fcP8yQtuFq0hhWfvED6D%2FrFNeEI9Z%2F3v6YdXNDjPCCo2eviJmOMGx%2Fnm5Qehkn%2BOcNFHtwx3jwf83jv%2BMjmS6bht3BrgjGWS6TkyB0bF3d4oFwyxJCz67zWYI%2BJRVlsrgTn%2BVC39vJlhoXhrLRfgQx6X1CL%2FJ4Y8kYVptPx3wJGhVi0fPqnrV7Tn2Bv7%2BU99I46Om8NG%2Bhx8pJWPxbVRHIwW1llR3geV5S6cIVBtl7%2BijbYeDfcVSw4AUl0KHdMNs6MS2mY2fd9CcMV5ROXRBJ9mdYKO%2BuZROzG4Zk4ALpUN0FfdPbpz5aX4oIag4WPvSxUpMcSWpbQ4Nz9flhSmuTVlgltVn540oqRWP4xGpkW5NFC9N5BRyyKRc6X9LGxEG9ILTkwos%2FJugY6ngFtp0tjYYqxeJysqG8Aw9%2BRzPuS5%2FLITN3Mbqn7hOWcRgx%2BtJVVmu3AFzUfsYysyKyknPc25pdPi6mdts0Yfl0HUY%2FQij4KYL9PRqpVa7PmK4OB%2BtgmJsLKQOaoPyQhvjae0Yu39Dr%2B6h0nJscnbtexiY9zGAy7uNdqMwzfQuERnBFLpvmrgmOnbo8C8mhEz0q%2FHgPnNyhZg8800rWegQ%3D%3D&X-Amz-Signature=6652c2c933d5956d5a4ae24965251a0d4e31d3c32d3b9173ac25c495041b825d&X-Amz-SignedHeaders=host&x-id=GetObject';
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
