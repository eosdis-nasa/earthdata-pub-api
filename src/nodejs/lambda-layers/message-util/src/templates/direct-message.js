const getDMTemplate = (params) => {
  const text = `Hello ${params.user.name},\n\nYou have received a direct message on the Earthdata Pub Dashboard.\n\nMessage:\n${params.eventMessage.conversation_last_message}`;
  const html = `
    <html>
       <body>
           <style>td h1 { margin: 0; padding: 0; font-size: 22px; }</style>
           <table border="0" cellpadding="10" cellspacing="0" style="width:100%">
             <tr style="width:100%;background:#f8f8f8">
                 <td>
                   <table>
                     <tr>
                       <td width="60"><img src = "https://pub.earthdata.nasa.gov/dashboard/images/app/src/assets/images/nasa-logo.78fcba4d9325e8ac5a2e15699d035ee0.svg"></td>
                       <td><h4>Earthdata Pub</h4></td>
                     </tr>
                   </table>
                 </td>
                 <td align="right"><b>Direct Message Received</b></td>
                 <td></td>
             </tr>
             <tr>
               <td colspan="2" style="padding:20px;">
                 <h1>Hello ${params.user.name},</h1><br><br>
                 <p>You have received a direct message on the Earthdata Pub Dashboard.</p>
                 <h2>Message:</h2><p>${params.eventMessage.conversation_last_message}</p><br><br>
                 
                 <p><a style="text-align: left;" href="${envUrl}/dashboard" aria-label="Visit Earthdata Pub Dashboard">${envUrl}/dashboard</a></p>
               </td>
             </tr>
          </table>
       </body>
     </html> 
    `;
  return [text, html];
};

module.exports.getDMTemplate = getDMTemplate;
