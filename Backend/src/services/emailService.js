/**
 * Brevo (Sendinblue) Transactional Email Service
 * Handles client confirmations and admin notifications for appointments & inquiries
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Low-level Brevo API dispatcher
 */
export async function sendBrevoEmail({ to, subject, htmlContent, textContent, replyTo, headers }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'ayush.athenura@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Gen-Vaani';

  if (!apiKey) {
    console.error('❌ [Brevo Email Error]: BREVO_API_KEY is not defined in environment variables.');
    return { success: false, error: 'BREVO_API_KEY missing' };
  }

  // Ensure 'to' is an array of recipient objects
  const recipients = Array.isArray(to)
    ? to.map((r) => (typeof r === 'string' ? { email: r } : r))
    : [{ email: typeof to === 'string' ? to : to.email, name: to.name || '' }];

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: recipients,
    subject,
    htmlContent,
  };

  // Provide plain-text fallback for anti-spam filtering & high deliverability
  if (textContent) {
    payload.textContent = textContent;
  }

  if (replyTo) {
    payload.replyTo = typeof replyTo === 'string' ? { email: replyTo } : replyTo;
  } else {
    payload.replyTo = { email: senderEmail, name: senderName };
  }

  if (headers) {
    payload.headers = headers;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [Brevo API Error]:', data);
      return { success: false, error: data.message || 'Brevo API rejected request' };
    }

    console.log(`✉️ [Brevo Email Sent]: ${subject} -> To: ${recipients.map((r) => r.email).join(', ')} (Message ID: ${data.messageId})`);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ [Brevo Network Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * HTML Email Template Generator with Gen-Vaani Brand Colors (Navy #00278a / Cyan #00cbf0)
 */
function generateEmailHtml({ title, subtitle, badgeText, contentHtml, ctaText, ctaUrl, isClient = true }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 15px;
      box-sizing: border-box;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 39, 138, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: radial-gradient(circle at 50% 20%, #00278a 0%, #020B2D 100%);
      padding: 45px 35px;
      text-align: center;
      color: #ffffff;
      position: relative;
    }
    .logo-text {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 15px 0;
      color: #ffffff;
    }
    .logo-cyan {
      color: #00cbf0;
    }
    .badge-pill {
      display: inline-block;
      background-color: rgba(0, 203, 240, 0.15);
      border: 1px solid rgba(0, 203, 240, 0.4);
      color: #00cbf0;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
    }
    .header p {
      margin: 0;
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.5;
    }
    .body {
      padding: 35px;
    }
    .detail-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
      border: 1.5px solid #00cbf0;
      border-radius: 14px;
      padding: 22px;
      margin-bottom: 25px;
      text-align: center;
    }
    .detail-date {
      font-size: 18px;
      font-weight: 800;
      color: #00278a;
      margin: 0 0 4px 0;
    }
    .detail-time {
      font-size: 24px;
      font-weight: 800;
      color: #0284c7;
      margin: 0 0 6px 0;
    }
    .detail-tz {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .data-table tr {
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table tr:last-child {
      border-bottom: none;
    }
    .data-table td {
      padding: 12px 6px;
      font-size: 14px;
      vertical-align: top;
    }
    .data-label {
      color: #64748b;
      font-weight: 600;
      width: 32%;
    }
    .data-val {
      color: #0f172a;
      font-weight: 700;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0 20px;
    }
    .btn-cta {
      display: inline-block;
      background: linear-gradient(90deg, #00278a 0%, #00cbf0 100%);
      color: #ffffff !important;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 34px;
      border-radius: 50px;
      box-shadow: 0 8px 20px rgba(0, 203, 240, 0.35);
    }
    .instructions-card {
      background-color: #f8fafc;
      border-left: 4px solid #00cbf0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-top: 25px;
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
    }
    .footer {
      background-color: #020B2D;
      padding: 30px 25px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer a {
      color: #00cbf0;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-copy {
      color: #64748b;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Brand Header -->
      <div class="header">
        <div class="logo-text">Gen<span class="logo-cyan">-Vaani</span></div>
        <div class="badge-pill">${badgeText}</div>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>

      <!-- Main Body -->
      <div class="body">
        ${contentHtml}

        ${
          ctaText && ctaUrl
            ? `
          <div class="btn-container">
            <a href="${ctaUrl}" target="_blank" class="btn-cta">
              ${ctaText} &rarr;
            </a>
          </div>
        `
            : ''
        }
      </div>

      <!-- Footer -->
      <div class="footer">
        <div>Gen-Vaani Innovations • Technology & Digital Product Engineering</div>
        <div style="margin-top: 4px;">
          Need to reschedule? Email us at <a href="mailto:info@genvaani.com">info@genvaani.com</a>
        </div>
        <div class="footer-copy">
          &copy; 2026 GenVaani Innovations Inc. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send Booking Confirmation Email to the Client / Visitor
 */
export async function sendAppointmentConfirmationToClient(meeting) {
  const title = 'Consultation Confirmed';
  const subtitle = `Hi ${meeting.clientName}, your strategy and technical scoping session has been successfully booked.`;
  const badgeText = 'APPOINTMENT CONFIRMED';

  const contentHtml = `
    <div class="detail-box">
      <div class="detail-date">${meeting.date}</div>
      <div class="detail-time">${meeting.time}</div>
      <div class="detail-tz">Timezone: ${meeting.timezone || 'Asia/Kolkata'}</div>
    </div>

    <table class="data-table">
      <tr>
        <td class="data-label">Service / Scope</td>
        <td class="data-val">${meeting.service}</td>
      </tr>
      <tr>
        <td class="data-label">Attendee</td>
        <td class="data-val">${meeting.clientName}</td>
      </tr>
      <tr>
        <td class="data-label">Email</td>
        <td class="data-val">${meeting.email}</td>
      </tr>
      ${
        meeting.phone
          ? `
      <tr>
        <td class="data-label">Phone</td>
        <td class="data-val">${meeting.phone}</td>
      </tr>`
          : ''
      }
      <tr>
        <td class="data-label">Platform</td>
        <td class="data-val">Google Meet (HD Video & Screen Share)</td>
      </tr>
      ${
        meeting.notes
          ? `
      <tr>
        <td class="data-label">Topic / Notes</td>
        <td class="data-val">${meeting.notes}</td>
      </tr>`
          : ''
      }
    </table>

    <div class="instructions-card">
      <strong>Preparation Tip:</strong> We recommend joining the video session 2 minutes early from a desktop or laptop to allow seamless screen sharing and Figma architecture reviews.
    </div>
  `;

  const meetUrl = meeting.meetUrl || 'https://meet.google.com/mjk-yknw-mvz';

  const textContent = `
Hi ${meeting.clientName},

Your strategy and technical scoping consultation with Gen-Vaani has been confirmed.

Session Details:
- Date: ${meeting.date}
- Time: ${meeting.time} (${meeting.timezone || 'Asia/Kolkata'})
- Service: ${meeting.service}
- Video Platform: Google Meet
- Direct Meeting Link: ${meetUrl}
${meeting.notes ? `- Notes: ${meeting.notes}` : ''}

Preparation Tip:
We recommend joining 2 minutes early from a laptop or desktop to allow seamless screen sharing and Figma architecture reviews.

Best regards,
Gen-Vaani Innovations Team
Website: https://genvaani.com
Support: info@genvaani.com
  `.trim();

  return sendBrevoEmail({
    to: { email: meeting.email, name: meeting.clientName },
    subject: `Confirmed: Consultation with Gen-Vaani - ${meeting.date} at ${meeting.time}`,
    htmlContent: generateEmailHtml({
      title,
      subtitle,
      badgeText,
      contentHtml,
      ctaText: 'Join Google Meet Session',
      ctaUrl: meetUrl,
      isClient: true,
    }),
    textContent,
    replyTo: {
      email: process.env.BREVO_SENDER_EMAIL || 'ayush.athenura@gmail.com',
      name: 'Gen-Vaani Innovations',
    },
    headers: {
      'X-Mailin-Tag': 'consultation-confirmation',
    },
  });
}

/**
 * Send Booking Notification Email to the Admin (ayush.athenura@gmail.com)
 */
export async function sendAppointmentNotificationToAdmin(meeting) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'ayush.athenura@gmail.com';
  const title = 'New Appointment Booked';
  const subtitle = `A new consultation has been booked on your calendar by ${meeting.clientName}.`;
  const badgeText = 'NEW CLIENT BOOKING';
  const meetUrl = meeting.meetUrl || 'https://meet.google.com/mjk-yknw-mvz';

  const textContent = `
New Consultation Booked:
- Client Name: ${meeting.clientName}
- Email: ${meeting.email}
- Phone: ${meeting.phone || 'N/A'}
- Company: ${meeting.company || 'Direct Client'}
- Service: ${meeting.service}
- Date & Time: ${meeting.date} at ${meeting.time} (${meeting.timezone || 'Asia/Kolkata'})
- Meeting Link: ${meetUrl}
- Notes: ${meeting.notes || 'None'}
  `.trim();

  const contentHtml = `
    <div class="detail-box">
      <div class="detail-date">${meeting.date}</div>
      <div class="detail-time">${meeting.time}</div>
      <div class="detail-tz">Timezone: ${meeting.timezone || 'Asia/Kolkata'}</div>
    </div>

    <table class="data-table">
      <tr>
        <td class="data-label">Client Name</td>
        <td class="data-val">${meeting.clientName}</td>
      </tr>
      <tr>
        <td class="data-label">Client Email</td>
        <td class="data-val"><a href="mailto:${meeting.email}" style="color: #0284c7;">${meeting.email}</a></td>
      </tr>
      ${
        meeting.phone
          ? `
      <tr>
        <td class="data-label">Phone</td>
        <td class="data-val"><a href="tel:${meeting.phone}" style="color: #0284c7;">${meeting.phone}</a></td>
      </tr>`
          : ''
      }
      <tr>
        <td class="data-label">Company / Brand</td>
        <td class="data-val">${meeting.company || 'Direct Client'}</td>
      </tr>
      <tr>
        <td class="data-label">Requested Service</td>
        <td class="data-val">${meeting.service}</td>
      </tr>
      <tr>
        <td class="data-label">Meeting Link</td>
        <td class="data-val"><a href="${meetUrl}" target="_blank" style="color: #0284c7;">${meetUrl}</a></td>
      </tr>
      <tr>
        <td class="data-label">Client Notes</td>
        <td class="data-val">${meeting.notes || 'No custom notes provided.'}</td>
      </tr>
      <tr>
        <td class="data-label">Booking Time</td>
        <td class="data-val">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (IST)</td>
      </tr>
    </table>
  `;

  return sendBrevoEmail({
    to: { email: adminEmail, name: 'Gen-Vaani Admin' },
    replyTo: { email: meeting.email, name: meeting.clientName },
    subject: `New Consultation: ${meeting.clientName} - ${meeting.service} (${meeting.date} at ${meeting.time})`,
    htmlContent: generateEmailHtml({
      title,
      subtitle,
      badgeText,
      contentHtml,
      ctaText: 'Open Google Meet Room',
      ctaUrl: meetUrl,
      isClient: false,
    }),
    textContent,
    headers: {
      'X-Mailin-Tag': 'admin-consultation-alert',
    },
  });
}

/**
 * Dispatch both Client and Admin emails concurrently
 */
export async function sendAppointmentEmails(meeting) {
  const [clientRes, adminRes] = await Promise.allSettled([
    sendAppointmentConfirmationToClient(meeting),
    sendAppointmentNotificationToAdmin(meeting),
  ]);

  return {
    clientEmail: clientRes.status === 'fulfilled' ? clientRes.value : { success: false, error: clientRes.reason },
    adminEmail: adminRes.status === 'fulfilled' ? adminRes.value : { success: false, error: adminRes.reason },
  };
}

/**
 * Dispatch Lead Reply directly from Admin Dashboard to Client
 */
export async function sendLeadReplyEmail({ to, clientName, subject, message, adminName }) {
  const formattedHtml = (message || '')
    .split('\n')
    .map(line => line.trim() ? `<p style="margin: 0 0 12px 0;">${line}</p>` : `<br/>`)
    .join('');

  const contentHtml = `
    <div style="font-size: 15px; line-height: 1.7; color: #1e293b; background: #ffffff; padding: 10px 0;">
      ${formattedHtml}
    </div>
    <div class="instructions-card" style="margin-top: 24px;">
      <strong>Note:</strong> You can reply directly to this email to continue the conversation with our engineering leadership.
    </div>
  `;

  return sendBrevoEmail({
    to: { email: to, name: clientName || '' },
    subject: subject || 'Response to your Gen-Vaani Inquiry',
    htmlContent: generateEmailHtml({
      title: subject || 'Response from Gen-Vaani',
      subtitle: `Message from ${adminName || 'Gen-Vaani Innovations'}`,
      badgeText: 'GEN-VAANI CLIENT INQUIRY RESPONSE',
      contentHtml,
      ctaText: 'View Our Services & Work',
      ctaUrl: process.env.CLIENT_URL || 'http://localhost:5173',
      isClient: true,
    }),
    textContent: message,
    replyTo: {
      email: process.env.BREVO_SENDER_EMAIL || 'ayush.athenura@gmail.com',
      name: adminName || 'Gen-Vaani Innovations',
    },
    headers: {
      'X-Mailin-Tag': 'admin-lead-reply',
    },
  });
}
