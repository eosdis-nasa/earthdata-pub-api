const getDMTemplate = (params, envUrl) => {
  let attachmentsHtml = '';
  if (params.eventMessage.attachments && params.eventMessage.attachments.length > 0) {
    attachmentsHtml = `
      <h3>Attachments:</h3>
      ${params.eventMessage.attachments.map((fileName) => `<p><a style="text-align: left;" href="${envUrl}/dashboard/download?${params.eventMessage.note_id}/${fileName}" aria-label="Download ${fileName}">${fileName}</a></p>`).join('')}`;
  }

  const text = `Hello ${params.user.name},\n\nYou have received a direct message on the Earthdata Pub Dashboard.\n\nMessage:\n${params.eventMessage.conversation_last_message}\n\nAttachments:\n${
    params.eventMessage.attachments && params.eventMessage.attachments.length > 0
      ? params.eventMessage.attachments.map((fileName) => `${envUrl}/dashboard/download?${params.eventMessage.note_id}/${fileName}`).join('\n') : 'None'
  }`;

  const html = `
    <html>
       <body>
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
                 <td align="right"><b>Direct Message Received</b></td>
                 <td></td>
             </tr>
             <tr>
               <td colspan="2" style="padding:20px;">
                 <h1>Hello ${params.user.name},</h1><br><br>
                 <p>You have received a direct message on the Earthdata Pub Dashboard.</p>
                 <h2>Message:</h2>
                 <p style="white-space: pre;">${decodeURI(params.eventMessage.conversation_last_message)}</p><br><br>
                 ${attachmentsHtml}
                 <br><br>
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

module.exports.getDMTemplate = getDMTemplate;
