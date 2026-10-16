import * as XLSX from 'xlsx';

/**
 * Auto-fit column widths based on maximum length of content
 */
const autoFitColumns = (worksheet, dataObjects, headerKeys) => {
  const colWidths = headerKeys.map((key) => {
    let maxLen = key.length;
    dataObjects.forEach((row) => {
      const val = row[key] !== undefined && row[key] !== null ? String(row[key]) : '';
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    });
    // Add padding, clamp between 14 and 60 characters
    return { wch: Math.min(Math.max(maxLen + 4, 14), 60) };
  });
  worksheet['!cols'] = colWidths;
};

/**
 * Format leads data for clean Excel columns
 */
export function formatLeadsForExcel(leads = []) {
  return leads.map((lead, index) => {
    const formattedDate = lead.createdAt
      ? new Date(lead.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : lead.date || 'Recent';

    let statusLabel = 'New Lead';
    if (lead.status === 'in_progress') statusLabel = 'In Discussion';
    else if (lead.status === 'converted') statusLabel = 'Converted Client';

    return {
      'S.No': index + 1,
      'Lead ID': lead._id || lead.id || `LD-${100 + index}`,
      'Prospect / Client Name': lead.name || 'N/A',
      'Company / Brand': lead.company || 'Direct Client',
      'Email Address': lead.email || 'N/A',
      'Phone Number': lead.phone || 'Not Provided',
      'Interested Service': lead.service || 'N/A',
      'Estimated Budget': lead.budget || 'Standard Scope',
      'Pipeline Status': statusLabel,
      'Acquisition Source': lead.source || 'Get In Touch Form',
      'Date Received': formattedDate,
      'Client Requirement / Message': lead.message || lead.comments || 'No comment provided',
      'Created At (UTC)': lead.createdAt ? new Date(lead.createdAt).toISOString() : 'N/A',
    };
  });
}

/**
 * Format meetings data for clean Excel columns
 */
export function formatMeetingsForExcel(meetings = []) {
  return meetings.map((meet, index) => {
    let statusLabel = 'Confirmed';
    if (meet.status === 'completed') statusLabel = 'Completed';
    else if (meet.status === 'cancelled') statusLabel = 'Cancelled';

    const formattedCreated = meet.createdAt
      ? new Date(meet.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'N/A';

    return {
      'S.No': index + 1,
      'Meeting ID': meet._id || meet.id || `MT-${500 + index}`,
      'Client Name': meet.clientName || meet.name || 'N/A',
      'Company / Organization': meet.company || 'Direct Client',
      'Client Email': meet.email || 'N/A',
      'Client Phone': meet.phone || 'Not Provided',
      'Service Requested': meet.service || 'Consultation',
      'Consultation Date': meet.date || meet.dateKey || 'N/A',
      'Date Key (YYYY-MM-DD)': meet.dateKey || 'N/A',
      'Time Slot': meet.time || 'N/A',
      'Timezone': meet.timezone || 'Asia/Kolkata',
      'Meeting Status': statusLabel,
      'Google Meet URL': meet.meetUrl || 'https://meet.google.com/mjk-yknw-mvz',
      'Agenda / Scoping Notes': meet.notes || 'Initial discovery consultation and tech scoping.',
      'Booked On': formattedCreated,
    };
  });
}

/**
 * Export Leads to Excel (.xlsx)
 */
export function exportLeadsToExcel(leads = [], customFilename = null) {
  if (!leads || leads.length === 0) {
    throw new Error('No leads available to export.');
  }

  const wb = XLSX.utils.book_new();
  const leadsData = formatLeadsForExcel(leads);
  const ws = XLSX.utils.json_to_sheet(leadsData);

  autoFitColumns(ws, leadsData, Object.keys(leadsData[0]));
  XLSX.utils.book_append_sheet(wb, ws, 'Leads & Inquiries');

  const todayStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Gen-Vaani_Leads_${todayStr}.xlsx`;

  XLSX.writeFile(wb, filename);
  return filename;
}

/**
 * Export Scheduled Meetings to Excel (.xlsx)
 */
export function exportMeetingsToExcel(meetings = [], customFilename = null) {
  if (!meetings || meetings.length === 0) {
    throw new Error('No meetings available to export.');
  }

  const wb = XLSX.utils.book_new();
  const meetsData = formatMeetingsForExcel(meetings);
  const ws = XLSX.utils.json_to_sheet(meetsData);

  autoFitColumns(ws, meetsData, Object.keys(meetsData[0]));
  XLSX.utils.book_append_sheet(wb, ws, 'Scheduled Meets');

  const todayStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Gen-Vaani_Scheduled_Meets_${todayStr}.xlsx`;

  XLSX.writeFile(wb, filename);
  return filename;
}

/**
 * Export Master Report with Leads, Scheduled Meetings, and Executive Summary
 */
export function exportMasterReportToExcel({ leads = [], meetings = [], adminName = 'Admin' }) {
  const wb = XLSX.utils.book_new();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Leads Sheet
  const leadsData = formatLeadsForExcel(leads);
  if (leadsData.length > 0) {
    const leadsWs = XLSX.utils.json_to_sheet(leadsData);
    autoFitColumns(leadsWs, leadsData, Object.keys(leadsData[0]));
    XLSX.utils.book_append_sheet(wb, leadsWs, 'Leads & Inquiries');
  }

  // 2. Scheduled Meetings Sheet
  const meetsData = formatMeetingsForExcel(meetings);
  if (meetsData.length > 0) {
    const meetsWs = XLSX.utils.json_to_sheet(meetsData);
    autoFitColumns(meetsWs, meetsData, Object.keys(meetsData[0]));
    XLSX.utils.book_append_sheet(wb, meetsWs, 'Scheduled Meets');
  }

  // 3. Summary Overview Sheet
  const summaryData = [
    { 'Metric / Attribute': 'Report Title', 'Details': 'Gen-Vaani Agency Operations Master Report' },
    { 'Metric / Attribute': 'Generated By', 'Details': adminName },
    { 'Metric / Attribute': 'Generated Date & Time', 'Details': new Date().toLocaleString() },
    { 'Metric / Attribute': 'Total Captured Leads', 'Details': leads.length },
    { 'Metric / Attribute': 'New Inquiries (Pending Review)', 'Details': leads.filter((l) => l.status === 'new').length },
    { 'Metric / Attribute': 'In Discussion Leads', 'Details': leads.filter((l) => l.status === 'in_progress').length },
    { 'Metric / Attribute': 'Converted Clients', 'Details': leads.filter((l) => l.status === 'converted').length },
    { 'Metric / Attribute': 'Total Scheduled Consultations', 'Details': meetings.length },
    { 'Metric / Attribute': 'Confirmed Upcoming Consultations', 'Details': meetings.filter((m) => m.status === 'confirmed').length },
    { 'Metric / Attribute': 'Completed Consultations', 'Details': meetings.filter((m) => m.status === 'completed').length },
    { 'Metric / Attribute': 'Platform Engine', 'Details': 'Gen-Vaani Innovations (React + Node.js + MongoDB)' },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  autoFitColumns(summaryWs, summaryData, ['Metric / Attribute', 'Details']);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Overview & KPI Summary');

  const filename = `Gen-Vaani_Master_Report_${todayStr}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}
