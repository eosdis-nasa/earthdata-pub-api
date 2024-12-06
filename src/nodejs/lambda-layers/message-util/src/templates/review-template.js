const https = require('https');

const getReviewerAddedTemplate = async (params, envUrl) => {

  const fetchImageUrl2 = async (url) => {
    const response = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        res.on('error', reject);
      }).on('error', reject);
    });
  
    if (response.statusCode === 200) {
      const jsonResponse = response.data;
      if (jsonResponse.url) {
        return jsonResponse.url;
      } else {
        throw new Error('URL not found in response');
      }
    } else {
      throw new Error(`Failed to fetch image. Status: ${response.statusCode}`);
    }
  };  
  
  const fetchImageUrl = async (url) => {
    const response = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        res.on('error', reject);
      }).on('error', reject);
    });
  
    if (response.statusCode === 200) {
      const jsonResponse = JSON.parse(response.data);
      if (jsonResponse.url) {
        return jsonResponse.url;
      } else {
        throw new Error('URL not found in response');
      }
    } else {
      throw new Error(`Failed to fetch image. Status: ${response.statusCode}`);
    }
  };  
  
  let imgSrc = '';
  let imgSrc2 = ''
  try {
    // Fetch the signed URL from the API
    imgSrc = await fetchImageUrl('https://pub.sit.earthdata.nasa.gov/image');
  } catch (error) {
    console.error(error.message);
  }
  try {
    // Fetch the signed URL from the API
    imgSrc2 = await fetchImageUrl2('https://pub.sit.earthdata.nasa.gov/image');
  } catch (error) {
    console.error(error.message);
  }

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
                        <!-- Use the signed URL as the src -->
                        <img src="" alt="Logo" style="display:block"/>   
                          ${imgSrc}
                          <p> deepak </p>
                          ${imgSrc2}
                      </td>
                      <td>
                        <h4>Earthdata Pub</h4>
                      </td>
                     </tr>
                   </table>
                 </td>
                 <td align="right"><b>Reviewer Added</b></td>
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
