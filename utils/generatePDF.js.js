const PDFDocument = require('pdfkit');

async function generateAgreementPDF(property) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end',  ()    => resolve(Buffer.concat(chunks)));
    doc.on('error', err  => reject(err));

    const today   = fmt(new Date());
    const goLive  = property.go_live_date ? fmt(new Date(property.go_live_date)) : '—';
    const signedOn = property.signed_at   ? fmt(new Date(property.signed_at))    : today;
    const minRent  = Number(property.approved_rent  || 0).toLocaleString('en-IN');
    const salesTgt = Number(property.sales_target   || 0).toLocaleString('en-IN');

    // Header
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#1a5e1f')
       .text('OPERATIONS AND MANAGEMENT SERVICE AGREEMENT', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(9).font('Helvetica').fillColor('#666')
       .text('Brise Hospitality Management (OPC) Pvt Ltd (avenaa.co.in)  |  CIN: U55101MH2024OPC449210  |  GSTIN: 27AAMCB6487H1Z4', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#1a5e1f').lineWidth(1.5).stroke();
    doc.moveDown(0.6);

    doc.fontSize(10).font('Helvetica').fillColor('#000')
       .text('This Agreement is made on ')
       .font('Helvetica-Bold').text(today + ' by and between;', { continued: false });
    doc.moveDown(0.6);

    // Parties
    h2(doc, '1. PARTIES');
    infoBox(doc, 'BRISE HOSPITALITY MANAGEMENT (OPC) PRIVATE LIMITED (avenaa.co.in)\nVaswani Chambers, 2nd Floor, 264-265, Dr Annie Besant Rd, Worli, Mumbai 400030\n(hereinafter referred to as "avenaa.co.in")');
    doc.fontSize(10).font('Helvetica-Bold').text('AND');
    doc.moveDown(0.3);
    infoBox(doc, `${property.agreement_full_name || '—'}\nAadhaar: XXXX-XXXX-${property.aadhaar_last4 || '—'}  |  PAN: ${property.pan_number || '—'}\nAddress: ${property.agreement_address || '—'}\n(hereinafter referred to as "avenaa.co.in Patron")`);

    // Financial Terms Table
    h2(doc, '2. APPROVED FINANCIAL TERMS (Non-negotiable)');
    const tY = doc.y;
    const cols = [50, 200, 350];
    const rH = 20;
    const tRows = [
      ['Term', 'Amount', 'Note'],
      ['Minimum Rent', `Rs.${minRent}/month`, 'Paid if sales target not achieved'],
      ['Sales Target', `Rs.${salesTgt}/month`, 'Patron gets 60% of net if achieved'],
      ['Patron Share', '60%', 'After OTA fee deduction'],
      ['Go-Live Date', goLive, ''],
      ['Duration', '11 months', 'From Go-Live Date'],
    ];
    tRows.forEach((row, i) => {
      const y = tY + i * rH;
      const isHeader = i === 0;
      doc.rect(50, y, 495, rH).fillColor(isHeader ? '#e8f5e9' : i % 2 === 0 ? '#ffffff' : '#f9fafb').fill();
      doc.fontSize(9).font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fillColor(isHeader ? '#1a5e1f' : '#000');
      doc.text(row[0], cols[0]+4, y+5, {width:145,lineBreak:false});
      doc.text(row[1], cols[1]+4, y+5, {width:145,lineBreak:false});
      doc.text(row[2], cols[2]+4, y+5, {width:190,lineBreak:false});
    });
    doc.rect(50, tY, 495, tRows.length * rH).strokeColor('#ccc').lineWidth(0.5).stroke();
    doc.y = tY + tRows.length * rH + 10;
    doc.moveDown(0.5);

    // Sections
    h2(doc, '3. PERCENTAGE SHARE');
    p(doc, 'Patron: 60% | avenaa.co.in: 40% of net profits after deducting OTA fee only.');

    h2(doc, '4. PAYMENTS');
    p(doc, 'Revenue report by 5th of every month. Payments by 7th. Patron to raise issues within 7 days.');

    h2(doc, '5. RESPONSIBILITIES');
    p(doc, 'avenaa.co.in: Marketing, booking management, housekeeping, guest service, electricity bills, weekly inspection, repairs within 3 working days.');
    p(doc, 'Patron: Provide fully furnished property (per Annexure I), maintain in good condition, grant access to staff.');

    h2(doc, '6. TERMINATION');
    p(doc, 'Either party: 1-month written notice. Violations by Patron governed by Sec 74, Indian Contract Act 1872.');

    h2(doc, '7. GOVERNING LAW');
    p(doc, 'Laws of India. Disputes via arbitration under Arbitration and Conciliation Act 1996. Seat: Mumbai, Maharashtra.');

    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text(`PLACE: MUMBAI     DATE: ${today}`, { align: 'center' });
    doc.moveDown(1.5);

    // Signatures
    const sY = doc.y;
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#000').text('BRISE HOSPITALITY MANAGEMENT', 50, sY);
    doc.text('PRIVATE LIMITED (avenaa.co.in)', 50, sY+12);
    doc.moveTo(50, sY+50).lineTo(230, sY+50).strokeColor('#000').lineWidth(0.5).stroke();
    doc.fontSize(9).font('Helvetica-Bold').text('Mr. Hrithik Agarwal', 50, sY+54);
    doc.fontSize(8).font('Helvetica').fillColor('#555').text('Director  |  DIN: 09186784', 50, sY+66);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#000').text('AVENAA.CO.IN PATRON', 330, sY);
    if (property.signature_image && property.signature_image.includes('base64')) {
      try {
        const b64 = property.signature_image.split(',')[1];
        doc.image(Buffer.from(b64,'base64'), 330, sY+8, { width:150, height:38 });
      } catch(e) {}
    }
    doc.moveTo(330, sY+50).lineTo(545, sY+50).strokeColor('#000').lineWidth(0.5).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#000').text(property.agreement_full_name||'—', 330, sY+54);
    doc.fontSize(8).font('Helvetica').fillColor('#555')
       .text(`Aadhaar: XXXX-XXXX-${property.aadhaar_last4||'—'}  |  PAN: ${property.pan_number||'—'}`, 330, sY+66)
       .text(`Signed on: ${signedOn}`, 330, sY+78);

    // Annexure I
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#1a5e1f').text('Annexure I — PATRON\'S RESPONSIBILITIES CHECKLIST', { align:'center' });
    doc.moveDown(0.5);
    [
      ['Living Room', 'Sofa set, Television, Coffee table, Dining table with crockery, Air conditioning (AC)'],
      ['Kitchen', 'Gas stove, Utensils, Water purifier, Refrigerator'],
      ['Bathroom', 'Geyser, Jet, Western toilet, Shower, Bucket'],
      ['Rooms', 'Air conditioning (AC), Mirror, Ceiling fan, Night light'],
    ].forEach(([a,i]) => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a5e1f').text(a+':');
      doc.fontSize(9).font('Helvetica').fillColor('#000').text(i, {indent:16});
      doc.moveDown(0.4);
    });

    doc.end();
  });
}

function h2(doc, t) {
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a5e1f').text(t);
  doc.moveDown(0.2);
}
function p(doc, t) {
  doc.fontSize(9).font('Helvetica').fillColor('#000').text(t, {indent:10});
  doc.moveDown(0.2);
}
function infoBox(doc, text) {
  const startY = doc.y;
  const lines = text.split('\n');
  const boxH = lines.length * 14 + 10;
  doc.rect(50, startY, 495, boxH).fillColor('#f9fafb').fill().strokeColor('#d1d5db').lineWidth(0.5).stroke();
  lines.forEach((line, i) => {
    doc.fontSize(9).font('Helvetica').fillColor('#000').text(line, 60, startY + 6 + i * 14, {width:480,lineBreak:false});
  });
  doc.y = startY + boxH + 8;
  doc.moveDown(0.3);
}
function fmt(d) {
  return d.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
}

module.exports = { generateAgreementPDF };
