/**
 * Brevo (Sendinblue) Transactional Email Service
 * Handles client confirmations and admin notifications for appointments & inquiries
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
export const EMAIL_LOGO_URL = 'https://ik.imagekit.io/vtfcbjo5c/branding/genvaani_email_logo_white.png';

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
    .logo-wrap {
      text-align: center;
      margin: 0 0 20px 0;
    }
    .logo-img {
      width: 220px;
      max-width: 100%;
      height: auto;
      display: inline-block;
      border: 0;
      outline: none;
      vertical-align: middle;
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
        <div class="logo-wrap">
          <a href="https://genvaani.com" target="_blank" style="text-decoration: none; display: inline-block;">
            <img
              src="${EMAIL_LOGO_URL}"
              alt="Gen-Vaani"
              width="220"
              height="39"
              class="logo-img"
              style="width: 220px; max-width: 100%; height: auto; display: block; margin: 0 auto; border: 0; outline: none; text-decoration: none;"
            />
          </a>
        </div>
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
        <div style="margin-bottom: 12px;">
          <a href="https://genvaani.com" target="_blank" style="text-decoration: none; display: inline-block;">
            <img
              src="${EMAIL_LOGO_URL}"
              alt="Gen-Vaani"
              width="140"
              height="25"
              style="width: 140px; max-width: 100%; height: auto; display: block; margin: 0 auto; opacity: 0.85; border: 0;"
            />
          </a>
        </div>
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

  const location = meeting.location || 'Google Meet';
  const meetUrl = meeting.meetUrl || 'https://meet.google.com/mjk-yknw-mvz';
  const teamsUrl = meeting.teamsUrl || 'https://teams.microsoft.com/l/meetup-join/genvaani';

  let platformLabel = 'Google Meet (HD Video & Screen Share)';
  let ctaText = 'Join Google Meet Session';
  let ctaUrl = meetUrl;
  let instructions = 'We recommend joining the video session 2 minutes early from a desktop or laptop to allow seamless screen sharing and architecture reviews.';

  if (location === 'Microsoft Teams') {
    platformLabel = 'Microsoft Teams Video Conference';
    ctaText = 'Join Microsoft Teams Session';
    ctaUrl = teamsUrl;
    instructions = 'We recommend opening the Microsoft Teams session 2 minutes early to test your audio and video settings.';
  } else if (location === 'Phone call') {
    platformLabel = `Direct Phone Consultation (We will call: ${meeting.phone || 'Your Number'})`;
    ctaText = '';
    ctaUrl = '';
    instructions = `Our senior architect will call you directly at <strong>${meeting.phone || 'your phone number'}</strong> at the scheduled time. Please ensure you are in a quiet environment.`;
  }

  const aestDisplay = meeting.aestTime ? ` · [${meeting.aestTime} AEST]` : '';

  const contentHtml = `
    <div class="detail-box">
      <div class="detail-date">${meeting.date}</div>
      <div class="detail-time">${meeting.time}${aestDisplay}</div>
      <div class="detail-tz">Timezone: ${meeting.timezone || 'Australia/Sydney'}</div>
    </div>

    <table class="data-table">
      <tr>
        <td class="data-label">Location / Type</td>
        <td class="data-val" style="color: #00278a; font-weight: 700;">${location}</td>
      </tr>
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
        <td class="data-label">Meeting Channel</td>
        <td class="data-val">${platformLabel}</td>
      </tr>
      ${
        location !== 'Phone call' && ctaUrl
          ? `
      <tr>
        <td class="data-label">Direct Link</td>
        <td class="data-val"><a href="${ctaUrl}" target="_blank" style="color: #0284c7; word-break: break-all;">${ctaUrl}</a></td>
      </tr>`
          : ''
      }
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
      <strong>Next Steps:</strong> ${instructions}
    </div>
  `;

  const textContent = `
Hi ${meeting.clientName},

Your strategy and technical scoping consultation with Gen-Vaani has been confirmed.

Session Details:
- Date: ${meeting.date}
- Time: ${meeting.time} (${meeting.timezone || 'Australia/Sydney'}) ${meeting.aestTime ? `[${meeting.aestTime} AEST]` : ''}
- Location: ${location}
- Service: ${meeting.service}
${ctaUrl ? `- Direct Session Link: ${ctaUrl}` : `- Phone Number to Call: ${meeting.phone}`}
${meeting.notes ? `- Notes: ${meeting.notes}` : ''}

Next Steps:
${instructions.replace(/<[^>]+>/g, '')}

Best regards,
Gen-Vaani Innovations Team
Website: https://genvaani.com
Support: info@genvaani.com
  `.trim();

  return sendBrevoEmail({
    to: { email: meeting.email, name: meeting.clientName },
    subject: `Confirmed: Consultation with Gen-Vaani (${location}) - ${meeting.date} at ${meeting.time}`,
    htmlContent: generateEmailHtml({
      title,
      subtitle,
      badgeText,
      contentHtml,
      ctaText,
      ctaUrl,
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
  const location = meeting.location || 'Google Meet';
  const meetUrl = meeting.meetUrl || 'https://meet.google.com/mjk-yknw-mvz';
  const teamsUrl = meeting.teamsUrl || 'https://teams.microsoft.com/l/meetup-join/genvaani';
  const sessionLink = location === 'Microsoft Teams' ? teamsUrl : meetUrl;

  const title = 'New Appointment Booked';
  const subtitle = `A new ${location} consultation has been booked on your calendar by ${meeting.clientName}.`;
  const badgeText = 'NEW CLIENT BOOKING';

  const textContent = `
New Consultation Booked:
- Location / Platform: ${location}
- Client Name: ${meeting.clientName}
- Email: ${meeting.email}
- Phone: ${meeting.phone || 'N/A'}
- Company: ${meeting.company || 'Direct Client'}
- Service: ${meeting.service}
- Client Time: ${meeting.date} at ${meeting.time} (${meeting.timezone || 'Australia/Sydney'})
- AEST Time: ${meeting.aestTime || meeting.time} AEST
${location === 'Phone call' ? `- Phone to call: ${meeting.phone}` : `- Meeting Link: ${sessionLink}`}
- Notes: ${meeting.notes || 'None'}
  `.trim();

  const contentHtml = `
    <div class="detail-box">
      <div class="detail-date">${meeting.date}</div>
      <div class="detail-time">${meeting.time} (${meeting.timezone || 'Local'})</div>
      <div class="detail-tz" style="color: #00278a; font-weight: 700;">Sydney / AEST Time: ${meeting.aestTime || meeting.time} AEST</div>
    </div>

    <table class="data-table">
      <tr>
        <td class="data-label">Location / Mode</td>
        <td class="data-val" style="color: #00278a; font-weight: 700;">${location}</td>
      </tr>
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
        <td class="data-label">Client Phone</td>
        <td class="data-val"><a href="tel:${meeting.phone}" style="color: #0284c7; font-weight: 700;">${meeting.phone}</a></td>
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
      ${
        location !== 'Phone call'
          ? `
      <tr>
        <td class="data-label">Meeting Link</td>
        <td class="data-val"><a href="${sessionLink}" target="_blank" style="color: #0284c7; word-break: break-all;">${sessionLink}</a></td>
      </tr>`
          : `
      <tr>
        <td class="data-label">Action Required</td>
        <td class="data-val" style="color: #ea580c; font-weight: 700;">Call client at ${meeting.phone}</td>
      </tr>`
      }
      <tr>
        <td class="data-label">Client Notes</td>
        <td class="data-val">${meeting.notes || 'No custom notes provided.'}</td>
      </tr>
      <tr>
        <td class="data-label">Booking Time</td>
        <td class="data-val">${new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })} (AEST)</td>
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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMeetingChannelInfo(meeting) {
  const location = meeting.location || 'Google Meet';
  const meetUrl = meeting.meetUrl || 'https://meet.google.com/mjk-yknw-mvz';
  const teamsUrl = meeting.teamsUrl || 'https://teams.microsoft.com/l/meetup-join/genvaani';

  if (location === 'Microsoft Teams') {
    return {
      location,
      platformLabel: 'Microsoft Teams Video Conference',
      joinUrl: teamsUrl,
      clientCtaText: 'Join Microsoft Teams Meeting',
      adminCtaText: 'Join Microsoft Teams Room',
    };
  }

  if (location === 'Phone call') {
    return {
      location,
      platformLabel: `Direct Phone Call (${meeting.phone || 'Client Phone'})`,
      joinUrl: '',
      clientCtaText: '',
      adminCtaText: meeting.phone ? `Call ${meeting.phone}` : '',
      adminCtaUrl: meeting.phone ? `tel:${meeting.phone}` : '',
    };
  }

  return {
    location: 'Google Meet',
    platformLabel: 'Google Meet (HD Video & Screen Share)',
    joinUrl: meetUrl,
    clientCtaText: 'Join Google Meet Now',
    adminCtaText: 'Open Google Meet Room',
  };
}

function formatTimeRemainingLabel(minutesUntilStart) {
  const mins = Math.max(1, Math.round(Number(minutesUntilStart) || 30));
  if (mins >= 28 && mins <= 32) return '30 minutes';
  return `${mins} minute${mins === 1 ? '' : 's'}`;
}

export function getAdminNotificationRecipients() {
  const raw = process.env.ADMIN_NOTIFICATION_EMAIL || 'ayush.athenura@gmail.com';
  const emails = raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (emails.length === 0) {
    return [{ email: 'ayush.athenura@gmail.com', name: 'Gen-Vaani Admin' }];
  }

  return emails.map((email) => ({ email, name: 'Gen-Vaani Admin' }));
}

/**
 * Send 30-Minute Meeting Reminder Email to the Client
 */
export async function sendMeetingReminderToClient(meeting, minutesUntilStart = 30) {
  const timeLeftLabel = formatTimeRemainingLabel(minutesUntilStart);
  const channel = getMeetingChannelInfo(meeting);
  const clientName = escapeHtml(meeting.clientName || 'Valued Client');
  const service = escapeHtml(meeting.service || 'Discovery Consultation');
  const dateDisplay = escapeHtml(meeting.date || meeting.dateKey || '');
  const timeDisplay = escapeHtml(meeting.time || '');
  const timezoneDisplay = escapeHtml(meeting.timezone || 'Australia/Sydney');
  const aestDisplay = meeting.aestTime ? ` · [${escapeHtml(meeting.aestTime)} AEST]` : '';

  const title = `Your Meeting Starts in ${timeLeftLabel}`;
  const subtitle = `Hi ${clientName}, this is a quick reminder for your upcoming consultation with Gen-Vaani.`;
  const badgeText = '30-MINUTE MEETING REMINDER';

  const instructions =
    channel.location === 'Phone call'
      ? `Please keep your phone handy. Our senior architect will call you at <strong>${escapeHtml(meeting.phone || 'your registered number')}</strong> in ${timeLeftLabel}.`
      : `Please join the ${escapeHtml(channel.location)} room a couple of minutes early from a desktop or laptop so we can start right on time.`;

  const contentHtml = `
    <div class="detail-box">
      <div class="detail-date">${dateDisplay}</div>
      <div class="detail-time">${timeDisplay}${aestDisplay}</div>
      <div class="detail-tz">Starts in ${escapeHtml(timeLeftLabel)} · Timezone: ${timezoneDisplay}</div>
    </div>

    <table class="data-table">
      <tr>
        <td class="data-label">Meeting Channel</td>
        <td class="data-val" style="color: #00278a; font-weight: 700;">${escapeHtml(channel.platformLabel)}</td>
      </tr>
      <tr>
        <td class="data-label">Service / Agenda</td>
        <td class="data-val">${service}</td>
      </tr>
      <tr>
        <td class="data-label">Attendee</td>
        <td class="data-val">${clientName}</td>
      </tr>
      ${
        channel.joinUrl
          ? `
      <tr>
        <td class="data-label">Direct Meeting Link</td>
        <td class="data-val"><a href="${escapeHtml(channel.joinUrl)}" target="_blank" style="color: #0284c7; word-break: break-all;">${escapeHtml(channel.joinUrl)}</a></td>
      </tr>`
          : ''
      }
      ${
        meeting.notes
          ? `
      <tr>
        <td class="data-label">Session Notes</td>
        <td class="data-val">${escapeHtml(meeting.notes)}</td>
      </tr>`
          : ''
      }
    </table>

    <div class="instructions-card">
      <strong>Quick Reminder:</strong> ${instructions}
    </div>
  `;

  const textContent = `
Hi ${meeting.clientName || 'Valued Client'},

Reminder: Your Gen-Vaani consultation starts in ${timeLeftLabel}.

Session Details:
- Date: ${meeting.date || meeting.dateKey}
- Time: ${meeting.time} (${meeting.timezone || 'Australia/Sydney'})${meeting.aestTime ? ` [${meeting.aestTime} AEST]` : ''}
- Channel: ${channel.location}
- Service: ${meeting.service}
${channel.joinUrl ? `- Join Link: ${channel.joinUrl}` : `- We will call you at: ${meeting.phone || 'your registered number'}`}
${meeting.notes ? `- Notes: ${meeting.notes}` : ''}

Best regards,
Gen-Vaani Innovations Team
https://genvaani.com
  `.trim();

  return sendBrevoEmail({
    to: { email: meeting.email, name: meeting.clientName || '' },
    subject: `Reminder: Your Gen-Vaani Meeting Starts in ${timeLeftLabel} (${meeting.time})`,
    htmlContent: generateEmailHtml({
      title,
      subtitle,
      badgeText,
      contentHtml,
      ctaText: channel.clientCtaText,
      ctaUrl: channel.joinUrl,
      isClient: true,
    }),
    textContent,
    replyTo: {
      email: process.env.BREVO_SENDER_EMAIL || 'ayush.athenura@gmail.com',
      name: 'Gen-Vaani Innovations',
    },
    headers: {
      'X-Mailin-Tag': 'client-meeting-reminder-30m',
    },
  });
}

/**
 * Send 30-Minute Meeting Reminder Email to the Admin
 */
export async function sendMeetingReminderToAdmin(meeting, minutesUntilStart = 30) {
  const timeLeftLabel = formatTimeRemainingLabel(minutesUntilStart);
  const channel = getMeetingChannelInfo(meeting);
  const adminRecipients = getAdminNotificationRecipients();

  const clientName = escapeHtml(meeting.clientName || 'Client');
  const service = escapeHtml(meeting.service || 'Consultation');
  const company = escapeHtml(meeting.company || 'Direct Client');
  const dateDisplay = escapeHtml(meeting.date || meeting.dateKey || '');
  const timeDisplay = escapeHtml(meeting.time || '');
  const timezoneDisplay = escapeHtml(meeting.timezone || 'Australia/Sydney');
  const aestTimeDisplay = escapeHtml(meeting.aestTime || meeting.time || '');

  const title = `Client Meeting in ${timeLeftLabel}`;
  const subtitle = `Upcoming ${escapeHtml(channel.location)} session with ${clientName} (${company}).`;
  const badgeText = `ADMIN REMINDER · STARTS IN ${timeLeftLabel.toUpperCase()}`;

  const adminCtaUrl = channel.location === 'Phone call' ? (channel.adminCtaUrl || '') : channel.joinUrl;

  const contentHtml = `
    <div class="detail-box">
      <div class="detail-date">${dateDisplay}</div>
      <div class="detail-time">${timeDisplay} (${timezoneDisplay})</div>
      <div class="detail-tz" style="color: #00278a; font-weight: 700;">Sydney / AEST Time: ${aestTimeDisplay} AEST · Starts in ${escapeHtml(timeLeftLabel)}</div>
    </div>

    <table class="data-table">
      <tr>
        <td class="data-label">Channel / Mode</td>
        <td class="data-val" style="color: #00278a; font-weight: 700;">${escapeHtml(channel.location)}</td>
      </tr>
      <tr>
        <td class="data-label">Client Name</td>
        <td class="data-val">${clientName}</td>
      </tr>
      <tr>
        <td class="data-label">Client Email</td>
        <td class="data-val"><a href="mailto:${escapeHtml(meeting.email)}" style="color: #0284c7;">${escapeHtml(meeting.email)}</a></td>
      </tr>
      ${
        meeting.phone
          ? `
      <tr>
        <td class="data-label">Client Phone</td>
        <td class="data-val"><a href="tel:${escapeHtml(meeting.phone)}" style="color: #0284c7; font-weight: 700;">${escapeHtml(meeting.phone)}</a></td>
      </tr>`
          : ''
      }
      <tr>
        <td class="data-label">Company / Brand</td>
        <td class="data-val">${company}</td>
      </tr>
      <tr>
        <td class="data-label">Service / Topic</td>
        <td class="data-val">${service}</td>
      </tr>
      ${
        channel.location !== 'Phone call' && channel.joinUrl
          ? `
      <tr>
        <td class="data-label">Meeting Link</td>
        <td class="data-val"><a href="${escapeHtml(channel.joinUrl)}" target="_blank" style="color: #0284c7; word-break: break-all;">${escapeHtml(channel.joinUrl)}</a></td>
      </tr>`
          : `
      <tr>
        <td class="data-label">Action Required</td>
        <td class="data-val" style="color: #ea580c; font-weight: 700;">Call client at ${escapeHtml(meeting.phone || 'N/A')} in ${escapeHtml(timeLeftLabel)}</td>
      </tr>`
      }
      <tr>
        <td class="data-label">Client Notes</td>
        <td class="data-val">${escapeHtml(meeting.notes || 'No custom notes provided.')}</td>
      </tr>
    </table>
  `;

  const textContent = `
Reminder: Client meeting starts in ${timeLeftLabel}.

- Client: ${meeting.clientName} (${meeting.company || 'Direct Client'})
- Email: ${meeting.email}
- Phone: ${meeting.phone || 'N/A'}
- Service: ${meeting.service}
- Channel: ${channel.location}
- Client Time: ${meeting.date || meeting.dateKey} at ${meeting.time} (${meeting.timezone || 'Australia/Sydney'})
- AEST Time: ${meeting.aestTime || meeting.time} AEST
${channel.location === 'Phone call' ? `- Call Client At: ${meeting.phone || 'N/A'}` : `- Meeting Link: ${channel.joinUrl}`}
- Notes: ${meeting.notes || 'None'}
  `.trim();

  return sendBrevoEmail({
    to: adminRecipients,
    replyTo: { email: meeting.email, name: meeting.clientName || '' },
    subject: `Reminder (${timeLeftLabel}): ${meeting.clientName} - ${meeting.service} (${meeting.aestTime || meeting.time} AEST)`,
    htmlContent: generateEmailHtml({
      title,
      subtitle,
      badgeText,
      contentHtml,
      ctaText: channel.adminCtaText,
      ctaUrl: adminCtaUrl,
      isClient: false,
    }),
    textContent,
    headers: {
      'X-Mailin-Tag': 'admin-meeting-reminder-30m',
    },
  });
}

/**
 * Dispatch 30-minute reminder emails to Client and Admin
 */
export async function sendMeetingReminderEmails(meeting, minutesUntilStart = 30, options = {}) {
  const { sendClient = true, sendAdmin = true } = options;

  const clientPromise = sendClient
    ? sendMeetingReminderToClient(meeting, minutesUntilStart)
    : Promise.resolve({ success: true, skipped: true });
  const adminPromise = sendAdmin
    ? sendMeetingReminderToAdmin(meeting, minutesUntilStart)
    : Promise.resolve({ success: true, skipped: true });

  const [clientRes, adminRes] = await Promise.allSettled([clientPromise, adminPromise]);

  return {
    clientEmail: clientRes.status === 'fulfilled' ? clientRes.value : { success: false, error: clientRes.reason?.message || String(clientRes.reason) },
    adminEmail: adminRes.status === 'fulfilled' ? adminRes.value : { success: false, error: adminRes.reason?.message || String(adminRes.reason) },
  };
}
