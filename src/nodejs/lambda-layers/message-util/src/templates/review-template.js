const getReviewerAddedTemplate = async (params, envUrl, xx) => {
  // Fallback Base64 image content (example provided here)
  const base64Logo = 'https://earthdatapub-dashboard-sit.s3.us-west-2.amazonaws.com/images/app/src/assets/images/nasa_test.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQXSOCK3LBZ7BN276%2F20241206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241206T005448Z&X-Amz-Expires=60&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGkaCXVzLXdlc3QtMiJGMEQCIE%2FSZSYJX9EXx9rXCIclXPGpWVStLEQVcga1xB%2FXsW8oAiBjv0FbHFfXiykdkZ4sXoTCkpNMH2F%2Bfthj73AHR8XoFSroAggiEAMaDDA1MDYyOTU5Njg4NiIM6aHjUChvlO4UJoIUKsUCSGOnoShdRAvgXHJE4dVvlsPbYkNbVzSe%2B7EbVddeQ3fiEsNeOL8H%2F%2BXwkCUpyKMuNeP4EGkLMxOrmDEQ9hMweQnsa1%2Bxhck6C6aTSVioID6bHHh4Z%2FSjEoG7Nx21s4hBfdlv6fHoC6NGA%2FyJCR5Rz86%2BySAAY6wO0yHad7dAii4RzoBU06U4ZnF5fUcvNBBk3X%2FNCbulIeB2lTeZoRAk6RXcLViyvbP%2BiIz1YU79yiBT5v%2B6akhp0vnyEXLNw13v8P9xL1hK2MqtsAH2rmML1RA0OPa1E0wj3%2B%2BHSHDpmUs4TSARhsNUHmAePHvemUD2UUOw%2BwHdhTbzcrWSLmfd3q07q%2BBjp0VQF2vTwVtc55fNfOY0KY9Agg9Dr9Z9Iv1ec6%2FVop1VzqIAb1lYtv8jlaOLGSW1QZxK2EBtjwGlFaNphNjqeDDXlsm6BjqfAfj%2FeyYIYFcLVQ0gxw7qzNtBnHDHKZyNoAOkw13Epi3CPPHi6HPBYfbPdwU706odDPHUDrKHSocZDED1un3dQmk9NGECb1Co6Aq8aMMzOD4Yx7dmiRfWWtJald0OCoGMdfcyjGlUxBTn2WC8%2F%2F36UDT9q%2FYvSOGvRO9HJPj6%2FOXJLiNh%2BJTQmcxHwjnYOS2ePABiFOupjdQVe%2B6tES30OA%3D%3D&X-Amz-Signature=0a8b186332b117fcd1e5a74ba1eff177d792c3b684a2cf537f3d743ff8f9a39f&X-Amz-SignedHeaders=host&x-id=GetObject';
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
