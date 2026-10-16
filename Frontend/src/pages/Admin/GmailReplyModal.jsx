import React, { useState, useEffect, useRef } from 'react';
import {
  FiSend,
  FiX,
  FiMinus,
  FiMaximize2,
  FiMinimize2,
  FiTrash2,
  FiPaperclip,
  FiSmile,
  FiLink,
  FiCheck,
  FiAlertCircle,
  FiLoader,
  FiUser,
  FiMail,
  FiChevronDown,
  FiExternalLink,
  FiInfo,
  FiRefreshCw
} from 'react-icons/fi';
import { replyLeadApi } from '../../services/leadApi';
import './GmailReplyModal.css';

// Iconic Gmail SVG Logo
const GmailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" fill="#EA4335" fillOpacity="0.12"/>
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 18L9 12" stroke="#FBBC05" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 18L15 12" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function GmailReplyModal({
  isOpen,
  lead,
  onClose,
  onSent,
  adminName = 'Ayush',
  adminEmail = 'ayushk17112004@gmail.com'
}) {
  const [recipient, setRecipient] = useState('');
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // Window view states: 'normal' (floating bottom-right), 'maximized' (centered large), 'minimized' (dock pill)
  const [viewState, setViewState] = useState('normal'); 

  // Dispatch states
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('discovery');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Template definitions
  const TEMPLATES = [
    {
      id: 'discovery',
      name: '📞 Discovery Call',
      getSubject: (leadService) => `Re: Gen-Vaani Consultation & Discovery - ${leadService || 'Project Inquiry'}`,
      getBody: (name, srv, msg) => `Hi ${name || 'there'},

Thank you for reaching out to Gen-Vaani regarding your ${srv || 'digital development'} project!

We reviewed your notes:
"${msg ? msg.trim() : 'Scheduled consultation'}"

We would love to connect for a quick 15-minute discovery call to explore your vision, walk through technical recommendations, and establish a high-impact roadmap for your project.

Are you available for a quick call this week? You can also pick a direct slot that works best for you here:
https://genvaani.com/contact

Looking forward to speaking with you!

Warm regards,
${adminName}
Founder & Lead Architect | Gen-Vaani Digital Experiences
${adminEmail} | +91 74280 31830
https://genvaani.com`
    },
    {
      id: 'proposal',
      name: '💼 Scope & Estimate',
      getSubject: (leadService) => `Proposal & Scope Overview: ${leadService || 'Custom Solution'} | Gen-Vaani`,
      getBody: (name, srv, msg) => `Hi ${name || 'there'},

Following up on your inquiry for ${srv || 'our specialized development services'}.

Based on your initial brief:
"${msg ? msg.trim() : 'Project consultation inquiry'}"

We have outlined an initial project scope covering:
• End-to-end custom UI/UX design and interactive prototype
• High-performance modern web architecture
• Full SEO optimization, responsive layout, and mobile fluid performance
• Dedicated deployment, analytics, and security hardening

I'd be glad to share an itemized proposal and timeline. Let me know if you would like me to prepare a tailored deck for your team!

Best regards,
${adminName}
Gen-Vaani Digital Experiences
${adminEmail}`
    },
    {
      id: 'details',
      name: '📋 Project Scope Details',
      getSubject: (leadService) => `Questionnaire: Tailoring your ${leadService || 'project'} with Gen-Vaani`,
      getBody: (name, srv) => `Hi ${name || 'there'},

To ensure we deliver the exact solution tailored to your goals for ${srv || 'your upcoming project'}, could you please share a few quick details:

1. What is your target launch deadline or timeline?
2. Do you have existing brand assets, wireframes, or reference websites you love?
3. What are the key features or integrations required (e.g., authentication, payment gateway, CMS, AI workflows)?

Once we receive your notes, we will provide a concrete architecture plan and transparent milestone budget.

Thank you,
${adminName}
Gen-Vaani Digital Experiences`
    },
    {
      id: 'welcome',
      name: '🚀 Welcome & Portfolio',
      getSubject: (leadService) => `Welcome to Gen-Vaani - Next steps for your ${leadService || 'inquiry'}`,
      getBody: (name, srv) => `Hi ${name || 'there'},

Welcome to Gen-Vaani! We are excited to collaborate with you on your ${srv || 'digital project'}.

At Gen-Vaani, we build bespoke web applications, high-converting digital storefronts, and cutting-edge digital experiences engineered for speed and aesthetic excellence.

Feel free to browse our latest client projects in the portfolio:
https://genvaani.com/portfolio

Whenever you're ready, simply reply to this email or let us know a convenient time to discuss next steps.

Best regards,
${adminName}
Gen-Vaani Digital Experiences`
    }
  ];

  // Initialize or re-populate when a lead is opened
  useEffect(() => {
    if (lead) {
      const email = lead.email || '';
      const name = lead.name || (email.split('@')[0]) || 'Client';
      const srv = lead.service || 'Web Development';
      const note = lead.message || lead.comments || lead.inquiryMessage || '';

      setRecipient(email);
      setClientName(name);
      setService(srv);
      setErrorMsg('');
      setSuccessMsg('');
      setShowCc(false);
      setShowBcc(false);
      setCc('');
      setBcc('');
      setViewState('normal');
      setAttachments([]);

      const initialTemplate = TEMPLATES[0];
      setSelectedTemplate(initialTemplate.id);
      setSubject(initialTemplate.getSubject(srv));
      setBody(initialTemplate.getBody(name, srv, note));
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  // Handle switching template
  const handleSelectTemplate = (templateId) => {
    const tmpl = TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    setSelectedTemplate(tmpl.id);
    setSubject(tmpl.getSubject(service));
    setBody(tmpl.getBody(clientName, service, lead.message || lead.comments || ''));
  };

  // Build direct Gmail Web Compose URL
  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc ? `&cc=${encodeURIComponent(cc)}` : ''}${bcc ? `&bcc=${encodeURIComponent(bcc)}` : ''}`;

  // Insert formatting or text at cursor
  const handleInsertText = (textToInsert) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = body;
    const updated = current.substring(0, start) + textToInsert + current.substring(end);
    setBody(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const handleInsertEmoji = (emoji) => {
    handleInsertText(emoji);
    setShowEmojiPicker(false);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newAttachments = files.map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB'
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Dispatch email via Brevo transactional API
  const handleSendEmail = async (markAsConverted = false) => {
    if (!recipient.trim()) {
      setErrorMsg('Please specify a valid recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('Please enter a subject line.');
      return;
    }
    if (!body.trim()) {
      setErrorMsg('Please write a message to send.');
      return;
    }

    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const leadId = lead._id || lead.id || 'new';
      const result = await replyLeadApi(leadId, {
        subject,
        message: body,
        recipientEmail: recipient,
        clientName,
        adminName
      });

      if (result && result.success) {
        setSuccessMsg(`✓ Email dispatched successfully to ${recipient}!`);
        
        // Notify parent to update lead in local state (advancing pipeline to In Discussion)
        if (onSent) {
          onSent(lead._id || lead.id, {
            status: markAsConverted ? 'converted' : 'in_progress',
            repliesCount: (lead.replies?.length || 0) + 1
          });
        }

        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const err = result?.message || 'Failed to dispatch email via Brevo API.';
        setErrorMsg(err);
      }
    } catch (err) {
      console.error('Error in handleSendEmail:', err);
      setErrorMsg(err.message || 'Network error while attempting to send email.');
    } finally {
      setSending(false);
    }
  };

  // If minimized, display sleek floating bottom-right dock bar
  if (viewState === 'minimized') {
    return (
      <div 
        className="gmail-compose-dock-pill animate-slide-up"
        onClick={() => setViewState('normal')}
        title="Click to restore compose window"
      >
        <div className="gmail-dock-left">
          <GmailIcon size={16} />
          <span className="gmail-dock-title">
            Reply: {clientName || recipient}
          </span>
        </div>
        <div className="gmail-dock-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button" 
            className="gmail-icon-btn dock-btn" 
            onClick={() => setViewState('normal')}
            title="Expand"
          >
            <FiMaximize2 size={13} />
          </button>
          <button 
            type="button" 
            className="gmail-icon-btn dock-btn" 
            onClick={onClose}
            title="Close"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>
    );
  }

  const containerClasses = [
    'gmail-compose-window',
    viewState === 'maximized' ? 'gmail-compose-maximized' : 'gmail-compose-normal',
    'animate-slide-up'
  ].join(' ');

  return (
    <>
      {/* Backdrop only when maximized */}
      {viewState === 'maximized' && (
        <div className="gmail-compose-backdrop" onClick={() => setViewState('normal')} />
      )}

      <div className={containerClasses} role="dialog" aria-modal="true" aria-label="Reply to lead">
        {/* ================= GMAIL TOP HEADER ================= */}
        <div className="gmail-window-header">
          <div className="gmail-header-title">
            <GmailIcon size={17} />
            <span className="gmail-title-text">
              Reply to {clientName}
            </span>
            <span className="gmail-lead-badge">
              {service}
            </span>
          </div>

          <div className="gmail-header-controls">
            <button
              type="button"
              className="gmail-ctrl-btn"
              onClick={() => setViewState('minimized')}
              title="Minimize"
              aria-label="Minimize"
            >
              <FiMinus size={15} />
            </button>
            <button
              type="button"
              className="gmail-ctrl-btn"
              onClick={() => setViewState(viewState === 'maximized' ? 'normal' : 'maximized')}
              title={viewState === 'maximized' ? 'Restore size' : 'Full screen'}
              aria-label="Toggle Fullscreen"
            >
              {viewState === 'maximized' ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
            </button>
            <button
              type="button"
              className="gmail-ctrl-btn close-btn"
              onClick={onClose}
              title="Save & Close"
              aria-label="Close"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* ================= QUICK TEMPLATES STRIP ================= */}
        <div className="gmail-templates-bar">
          <span className="gmail-templates-label">Quick Templates:</span>
          <div className="gmail-templates-chips">
            {TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                type="button"
                className={`gmail-template-chip ${selectedTemplate === tmpl.id ? 'active' : ''}`}
                onClick={() => handleSelectTemplate(tmpl.id)}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= FIELDS CONTAINER ================= */}
        <div className="gmail-fields-container">
          {/* TO ROW */}
          <div className="gmail-field-row">
            <span className="gmail-field-label">To</span>
            <div className="gmail-recipient-chip-wrapper">
              <div className="gmail-recipient-pill">
                <div className="gmail-pill-avatar">
                  {clientName ? clientName.charAt(0).toUpperCase() : <FiUser size={12} />}
                </div>
                <span className="gmail-pill-name">{clientName}</span>
                <span className="gmail-pill-email">&lt;{recipient}&gt;</span>
              </div>
            </div>

            <div className="gmail-field-helpers">
              {!showCc && (
                <button type="button" className="gmail-helper-btn" onClick={() => setShowCc(true)}>
                  Cc
                </button>
              )}
              {!showBcc && (
                <button type="button" className="gmail-helper-btn" onClick={() => setShowBcc(true)}>
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* CC ROW (Optional) */}
          {showCc && (
            <div className="gmail-field-row">
              <span className="gmail-field-label">Cc</span>
              <input
                type="email"
                className="gmail-field-input"
                placeholder="Cc recipients (comma separated)"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
              />
              <button 
                type="button" 
                className="gmail-remove-row-btn" 
                onClick={() => { setShowCc(false); setCc(''); }}
                title="Remove Cc"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* BCC ROW (Optional) */}
          {showBcc && (
            <div className="gmail-field-row">
              <span className="gmail-field-label">Bcc</span>
              <input
                type="email"
                className="gmail-field-input"
                placeholder="Bcc recipients"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
              />
              <button 
                type="button" 
                className="gmail-remove-row-btn" 
                onClick={() => { setShowBcc(false); setBcc(''); }}
                title="Remove Bcc"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* SUBJECT ROW */}
          <div className="gmail-field-row subject-row">
            <input
              type="text"
              className="gmail-subject-input"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        {/* ================= MESSAGE BODY ================= */}
        <div className="gmail-body-area">
          <textarea
            ref={textareaRef}
            className="gmail-message-textarea"
            placeholder="Write your reply here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            autoFocus
          />

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="gmail-attachments-list">
              {attachments.map((att, idx) => (
                <div key={idx} className="gmail-attachment-chip">
                  <FiPaperclip size={13} className="att-icon" />
                  <span className="att-name">{att.name}</span>
                  <span className="att-size">({att.size})</span>
                  <button 
                    type="button" 
                    className="att-remove-btn" 
                    onClick={() => removeAttachment(idx)}
                    title="Remove attachment"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Inline Notification Banner */}
          {errorMsg && (
            <div className="gmail-status-banner error animate-fade-in">
              <FiAlertCircle size={15} />
              <span>{errorMsg}</span>
              <a 
                href={gmailWebComposeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="gmail-error-fallback-link"
              >
                Open directly in Gmail Web <FiExternalLink size={12} />
              </a>
            </div>
          )}

          {successMsg && (
            <div className="gmail-status-banner success animate-fade-in">
              <FiCheck size={16} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* ================= BOTTOM TOOLBAR & ACTION BAR ================= */}
        <div className="gmail-footer-bar">
          <div className="gmail-footer-left">
            {/* Split Send Button (Material 3 Gmail Style) */}
            <div className="gmail-send-group">
              <button
                type="button"
                className="gmail-send-btn"
                disabled={sending}
                onClick={() => handleSendEmail(false)}
                title="Send reply to client"
              >
                {sending ? (
                  <>
                    <FiLoader className="gmail-spin" size={15} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <FiSend size={14} style={{ marginLeft: '4px' }} />
                  </>
                )}
              </button>
              <button
                type="button"
                className="gmail-send-dropdown-btn"
                disabled={sending}
                onClick={() => setShowSendOptions(!showSendOptions)}
                title="More send options"
              >
                <FiChevronDown size={14} />
              </button>

              {showSendOptions && (
                <div className="gmail-send-menu animate-fade-in">
                  <button
                    type="button"
                    className="gmail-send-menu-item"
                    onClick={() => {
                      setShowSendOptions(false);
                      handleSendEmail(false);
                    }}
                  >
                    <FiSend size={14} /> Send & Mark "In Discussion"
                  </button>
                  <button
                    type="button"
                    className="gmail-send-menu-item"
                    onClick={() => {
                      setShowSendOptions(false);
                      handleSendEmail(true);
                    }}
                  >
                    <FiCheck size={14} /> Send & Mark "Converted"
                  </button>
                </div>
              )}
            </div>

            {/* Direct Open in Gmail Web Button */}
            <a
              href={gmailWebComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gmail-web-btn"
              title="Open full draft in your actual Gmail web tab"
            >
              <GmailIcon size={16} />
              <span>Open in Gmail Web</span>
              <FiExternalLink size={12} />
            </a>

            {/* Formatting Toolbar */}
            <div className="gmail-format-tools">
              <button
                type="button"
                className="gmail-tool-btn"
                onClick={() => handleInsertText('**bold**')}
                title="Bold"
              >
                <b>B</b>
              </button>
              <button
                type="button"
                className="gmail-tool-btn"
                onClick={() => handleInsertText('*italic*')}
                title="Italic"
              >
                <i>I</i>
              </button>
              <button
                type="button"
                className="gmail-tool-btn"
                onClick={() => handleInsertText('• ')}
                title="Bullet list"
              >
                •
              </button>

              {/* Attachment Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileAttach} 
                style={{ display: 'none' }} 
                multiple
              />
              <button
                type="button"
                className="gmail-tool-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files"
              >
                <FiPaperclip size={15} />
              </button>

              {/* Link Button */}
              <button
                type="button"
                className="gmail-tool-btn"
                onClick={() => handleInsertText('https://genvaani.com')}
                title="Insert link"
              >
                <FiLink size={15} />
              </button>

              {/* Emoji Picker Button */}
              <div className="gmail-emoji-container">
                <button
                  type="button"
                  className="gmail-tool-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Insert emoji"
                >
                  <FiSmile size={15} />
                </button>
                {showEmojiPicker && (
                  <div className="gmail-emoji-popover animate-fade-in">
                    {['👍', '🚀', '💼', '✨', '📞', '📅', '🎉', '🤝', '💡', '🔥'].map((em, i) => (
                      <button
                        key={i}
                        type="button"
                        className="gmail-emoji-item"
                        onClick={() => handleInsertEmoji(em)}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="gmail-footer-right">
            <button
              type="button"
              className="gmail-discard-btn"
              onClick={onClose}
              title="Discard draft"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
