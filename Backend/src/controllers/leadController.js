import { Lead } from '../models/Lead.js';
import XLSX from 'xlsx';
import { sendLeadReplyEmail } from '../services/emailService.js';

// Initial sample leads to seed if database is empty
const SEED_LEADS = [
  {
    name: 'Ananya Deshmukh',
    company: 'Apex Healthcare Labs',
    email: 'ananya@apexlabs.in',
    phone: '+91 98201 44521',
    service: 'Custom Web Application',
    budget: '₹2,50,000 - ₹5,00,000',
    status: 'new',
    message: 'Looking for a HIPAA-compliant patient management portal with real-time reporting.',
    source: 'Get In Touch Form',
  },
  {
    name: 'Rohan Mehra',
    company: 'Mehra Fine Jewels',
    email: 'rohan@mehrajewels.com',
    phone: '+91 97112 88902',
    service: 'UI/UX Product Architecture',
    budget: '₹1,50,000 - ₹3,00,000',
    status: 'in_progress',
    message: 'Need high-converting luxury e-commerce experience redesign with 3D product previews.',
    source: 'Get In Touch Form',
  },
  {
    name: 'Vikramaditya Rao',
    company: 'Stellar Fintech',
    email: 'v.rao@stellarfin.io',
    phone: '+91 98334 11200',
    service: 'Enterprise Mobile App',
    budget: '₹6,00,000 - ₹10,00,000',
    status: 'in_progress',
    message: 'Cross-platform React Native investment wallet with bank SDK integrations.',
    source: 'Get In Touch Form',
  },
  {
    name: 'Sarah Jenkins',
    company: 'HyperGrowth Retail UK',
    email: 'sarah.j@hypergrowth.co.uk',
    phone: '+44 7911 123456',
    service: 'Performance Ads & Meta',
    budget: '£3,000/mo Retainer',
    status: 'new',
    message: 'Want to scale our D2C apparel brand into European markets with ROAS > 3.8x.',
    source: 'Get In Touch Form',
  },
  {
    name: 'Devendra Patel',
    company: 'KisanConnect Logistics',
    email: 'devendra@kisanconnect.org',
    phone: '+91 94250 77189',
    service: 'Full Agency Retainer',
    budget: '₹8,00,000+',
    status: 'converted',
    message: 'End-to-end web platform, driver mobile apps, and national brand launch campaign.',
    source: 'Get In Touch Form',
  },
];

/**
 * @desc    Create a new lead from "Get In Touch" submission
 * @route   POST /api/leads
 * @access  Public
 */
export const createLead = async (req, res) => {
  try {
    const { name, email, service, message, comments, phone, company, budget } = req.body;
    const finalMessage = message || comments;

    // Validation
    if (!name || !email || !service || !finalMessage) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email Address, Service, and Message/Comments are required fields.',
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Attempt to extract company or brand from email if not provided
    let extractedCompany = company;
    if (!extractedCompany || extractedCompany.trim() === '') {
      const domain = email.split('@')[1];
      if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domain.toLowerCase())) {
        extractedCompany = domain.split('.')[0].toUpperCase();
      } else {
        extractedCompany = 'Direct Client';
      }
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      service: service.trim(),
      message: finalMessage.trim(),
      phone: phone ? phone.trim() : '',
      company: extractedCompany,
      budget: budget || 'Discovery Consultation',
      status: 'new',
      source: 'Get In Touch Form',
    });

    console.log(`📥 [Lead Captured]: ${lead.name} (${lead.email}) for service: ${lead.service}`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your details have been received. Our team will contact you shortly.',
      lead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing your inquiry.',
    });
  }
};

/**
 * @desc    Get all leads for Admin Dashboard
 * @route   GET /api/leads
 * @access  Public / Admin
 */
export const getLeads = async (req, res) => {
  try {
    let count = await Lead.countDocuments();

    // Auto-seed if database is brand new
    if (count === 0) {
      console.log('🌱 Seeding initial demonstration leads into MongoDB...');
      await Lead.insertMany(SEED_LEADS);
    }

    const leads = await Lead.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leads from database.',
    });
  }
};

/**
 * @desc    Update a lead status (new -> in_progress -> converted)
 * @route   PATCH /api/leads/:id
 * @access  Admin
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'in_progress', 'converted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead status. Must be "new", "in_progress", or "converted".',
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead status updated successfully.',
      lead,
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead status.',
    });
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Admin
 */
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead.',
    });
  }
};

/**
 * @desc    Export all leads to Excel (.xlsx) spreadsheet
 * @route   GET /api/leads/export/excel
 * @access  Public / Admin
 */
export const exportLeadsExcel = async (req, res) => {
  try {
    let leads = await Lead.find().sort({ createdAt: -1 });
    if (!leads || leads.length === 0) {
      leads = SEED_LEADS;
    }

    const rows = leads.map((lead, index) => {
      let statusLabel = 'New Lead';
      if (lead.status === 'in_progress') statusLabel = 'In Discussion';
      else if (lead.status === 'converted') statusLabel = 'Converted Client';

      const dateStr = lead.createdAt
        ? new Date(lead.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : lead.date || 'Recent';

      return {
        'S.No': index + 1,
        'Lead ID': lead._id ? String(lead._id) : `LD-${100 + index}`,
        'Client / Prospect Name': lead.name || 'N/A',
        'Company / Brand': lead.company || 'Website Inquiry',
        'Email Address': lead.email || 'N/A',
        'Phone Number': lead.phone || 'Not Provided',
        'Interested Service': lead.service || 'N/A',
        'Estimated Budget': lead.budget || 'Standard Scope',
        'Pipeline Status': statusLabel,
        'Acquisition Source': lead.source || 'Get In Touch Form',
        'Date Received': dateStr,
        'Client Requirement / Message': lead.message || lead.comments || 'No comment provided',
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    if (rows.length > 0) {
      const keys = Object.keys(rows[0]);
      ws['!cols'] = keys.map((key) => {
        let maxLen = key.length;
        rows.forEach((r) => {
          const val = r[key] !== undefined && r[key] !== null ? String(r[key]) : '';
          if (val.length > maxLen) maxLen = val.length;
        });
        return { wch: Math.min(Math.max(maxLen + 4, 14), 60) };
      });
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Leads & Inquiries');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const today = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Gen-Vaani_Leads_${today}.xlsx"`);
    return res.send(buffer);
  } catch (error) {
    console.error('Error exporting leads to Excel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export leads to Excel spreadsheet.',
    });
  }
};

/**
 * @desc    Send email reply directly to a lead via Brevo
 * @route   POST /api/leads/:id/reply
 * @access  Admin
 */
export const replyToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message, recipientEmail, clientName, adminName } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required fields.',
      });
    }

    let lead = null;
    if (id && id.length === 24) {
      lead = await Lead.findById(id);
    }

    const targetEmail = (recipientEmail || lead?.email || '').trim();
    const targetName = (clientName || lead?.name || 'Valued Client').trim();

    if (!targetEmail) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email address is missing or invalid.',
      });
    }

    console.log(`📨 [Admin Dispatching Reply] -> To: ${targetEmail} | Subject: "${subject}"`);

    // Dispatch transactional email via Brevo
    let emailResult = { success: true };
    try {
      emailResult = await sendLeadReplyEmail({
        to: targetEmail,
        clientName: targetName,
        subject,
        message,
        adminName: adminName || 'Ayush (Gen-Vaani)',
      });
    } catch (err) {
      console.warn('⚠️ [Email Dispatch Warning]:', err.message);
      emailResult = { success: false, error: err.message };
    }

    // Advance pipeline status to in_progress and log reply
    if (lead) {
      if (lead.status === 'new') {
        lead.status = 'in_progress';
      }
      if (!Array.isArray(lead.replies)) {
        lead.replies = [];
      }
      lead.replies.push({
        subject,
        message,
        sentAt: new Date(),
        sentBy: adminName || 'Admin',
      });
      await lead.save();
    }

    return res.status(200).json({
      success: true,
      message: `Reply sent successfully to ${targetEmail}`,
      emailResult,
      lead,
    });
  } catch (error) {
    console.error('Error replying to lead:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while sending email reply.',
    });
  }
};
