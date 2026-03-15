const puppeteer = require('puppeteer');

async function generateAgreementPDF(property) {
  const today   = fmt(new Date());
  const goLive  = property.go_live_date ? fmt(new Date(property.go_live_date)) : '—';
  const signedOn = property.signed_at   ? fmt(new Date(property.signed_at))    : today;
  const minRent  = Number(property.approved_rent).toLocaleString('en-IN');
  const salesTgt = Number(property.sales_target).toLocaleString('en-IN');
  const minRentW = words(Number(property.approved_rent));
  const salesW   = words(Number(property.sales_target));

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Times New Roman",serif;font-size:11.5px;color:#000;padding:36px 48px;line-height:1.75}
  .hdr{text-align:center;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #1a5e1f}
  .logo{height:44px;margin-bottom:8px}
  h1{font-size:15px;font-weight:bold;text-decoration:underline;margin-bottom:4px}
  h2{font-size:12.5px;font-weight:bold;margin:16px 0 5px;border-bottom:1px solid #ccc;padding-bottom:3px}
  p{margin:5px 0;text-align:justify}
  .pb{font-weight:bold} .ul{text-decoration:underline}
  .box{border:1px solid #bbb;padding:10px 14px;border-radius:4px;margin:8px 0;background:#fafafa}
  ul{margin:5px 0 5px 22px} li{margin:3px 0}
  table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11px}
  th{background:#e8f5e9;padding:6px 8px;border:1px solid #999;text-align:left;font-weight:bold}
  td{padding:5px 8px;border:1px solid #ccc;vertical-align:top}
  .hl{background:#fffde7;padding:5px 10px;border-left:3px solid #f59e0b;margin:8px 0;font-size:11px}
  .pg{page-break-before:always}
  .sigs{margin-top:48px;display:flex;justify-content:space-between;page-break-inside:avoid}
  .sb{width:46%}
  .sl{border-top:1px solid #000;margin-top:52px;margin-bottom:4px}
  .sig-img{max-height:56px;max-width:180px;display:block;margin-left:auto;margin-bottom:4px}
</style>
</head><body>

<div class="hdr">
  <img src="${process.env.OWNER_PORTAL_URL || 'http://localhost:3000'}/logo.png" class="logo" onerror="this.style.display='none'"/>
  <h1>Operations and Management Service Agreement</h1>
</div>

<p>This Agreement is made on <span class="pb">${today}</span> by and between;</p>

<h2>1. PARTIES</h2>
<div class="box">
  <p><span class="pb">BRISE HOSPITALITY MANAGEMENT (OPC) PRIVATE LIMITED (avenaa.co.in)</span><br/>
  CIN: U55101MH2024OPC449210 &nbsp;|&nbsp; GSTIN: 27AAMCB6487H1Z4<br/>
  Vaswani Chambers, 2nd Floor, 264-265, Dr Annie Besant Rd, Worli, Mumbai, Maharashtra 400030<br/>
  (hereinafter referred to as <span class="pb">"avenaa.co.in"</span>, <span class="pb">"We"</span>, <span class="pb">"Our"</span> or <span class="pb">"Us"</span>)</p>
</div>
<p class="pb">AND</p>
<div class="box">
  <p><span class="pb">${property.agreement_full_name}</span><br/>
  Aadhaar No: XXXX-XXXX-${property.aadhaar_last4} &nbsp;|&nbsp; PAN: ${property.pan_number}<br/>
  Address: ${property.agreement_address}<br/>
  (hereinafter referred to as <span class="pb">"avenaa.co.in Patron"</span>)</p>
  <p style="margin-top:6px;"><span class="pb">${property.agreement_full_name}</span> is the Owner of the Property at: <span class="pb">${property.address}, ${property.city}</span></p>
</div>
<p>By accepting and digitally signing this Agreement, the avenaa.co.in Patron also agrees to the recommended Terms and conditions, privacy policies and other policies published at avenaa.co.in Platform.</p>

<h2>2. DEFINITIONS</h2>
<ul>
  <li><span class="pb">Applicable Law</span> — all applicable statutes, laws, ordinances, rules, regulations, notifications, guidelines, judicial and administrative decisions of any governmental or regulatory authority.</li>
  <li><span class="pb">Account</span> — the account created by the avenaa.co.in Patron on the avenaa.co.in Platform.</li>
  <li><span class="pb">Commercial Terms</span> — the financial terms associated with the provision of Products and Services under this Agreement.</li>
  <li><span class="pb">Go-live Date: ${goLive}</span> — the date when the Property is listed and made available for bookings on the avenaa.co.in Platform.</li>
  <li><span class="pb">Duration</span> — Agreement shall be valid only for 11 months from the Go-live Date as per mutual understanding.</li>
  <li><span class="pb">OTA</span> — Online Travel Agent: all online travel agents, meta channels, online aggregators, or any other online search engines where the Property is listed.</li>
  <li><span class="pb">Property</span> — the homes/property/apartment owned/leased and/or operated by the avenaa.co.in Patron.</li>
  <li><span class="pb">Value Added Services (VAS)</span> — new or improved technologies, tools, applications and services developed by avenaa.co.in to enhance occupancy and guest experience.</li>
  <li><span class="pb">The dispute</span> — If the property Patron does not provide possession on the Go-live date after a week from the given date, avenaa.co.in has the right to take legal action as per applicable laws.</li>
</ul>

<h2>3. PERCENTAGE SHARE</h2>
<p><span class="pb">a)</span> The Patron shall be entitled to <span class="pb">60% avenaa.co.in Patron</span> and <span class="pb">40% avenaa.co.in</span> in the profits generated from avenaa.co.in's operation.</p>
<p><span class="pb">b)</span> The percentage share shall be calculated based on the net profit after deducting OTA fee amount only.</p>
<p><span class="pb">c)</span> Net profit will be based on the allocation report generated from the avenaa.co.in Platform.</p>

<h2>4. ALLOCATION OF PROFITS</h2>
<p><span class="pb">a)</span> Profits shall be allocated to the Patron and the Company in proportion to their respective percentage shares.</p>
<p><span class="pb">b)</span> Allocation shall be made every month and distributed to the Patron by the 7th of every next month.</p>

<h2>6. PURPOSE OF THE AGREEMENT</h2>
<p><span class="pb">a)</span> The Parties have entered into this Agreement to set out terms and conditions under which avenaa.co.in shall provide Products and services to the avenaa.co.in Patron, with minimum rent.</p>
<p><span class="pb">b)</span> With a 60% Partnership, avenaa.co.in shall equip the Patron with operational capabilities and technologies to achieve high occupancies and improve earnings by listing their property on avenaa.co.in's Platform.</p>

<div class="pg"></div>
<div class="hdr" style="margin-bottom:14px;">
  <img src="${process.env.OWNER_PORTAL_URL || 'http://localhost:3000'}/logo.png" class="logo" onerror="this.style.display='none'"/>
</div>

<h2>10. PATRON SHARE — KEY FINANCIAL TERMS</h2>
<div class="hl"><span class="pb">Approved financial terms for this property (set by Avenaa team — non-negotiable):</span></div>
<table>
  <tr><th>Term</th><th>Approved Amount</th><th>Details</th></tr>
  <tr><td><b>Minimum Rent</b></td><td><b>₹${minRent}/month</b></td><td>Rs. ${minRent}/- (${minRentW}) per month. Paid if sales target is not achieved.</td></tr>
  <tr><td><b>Sales Target</b></td><td><b>₹${salesTgt}/month</b></td><td>Rs. ${salesTgt}/- (${salesW}) per month. If achieved, Patron receives 60% of net revenue.</td></tr>
  <tr><td><b>Patron Share</b></td><td><b>60%</b></td><td>Of net profit after OTA fee deduction</td></tr>
  <tr><td><b>Go-Live Date</b></td><td colspan="2"><b>${goLive}</b></td></tr>
  <tr><td><b>Property</b></td><td colspan="2">${property.property_name} — ${property.address}, ${property.city}</td></tr>
  <tr><td><b>Agreement Duration</b></td><td colspan="2">11 months from Go-Live Date</td></tr>
</table>

<h2>7. PAYMENTS AND RECONCILIATION</h2>
<p><span class="pb">a)</span> avenaa.co.in shall provide Revenue details of the Property generated in the preceding month to avenaa.co.in Patron.</p>
<p><span class="pb">b)</span> Reconciliation statement within 5th of every next month. Patron to raise issues within 7 days.</p>
<p><span class="pb">c)</span> avenaa.co.in is entitled to charge Direct Guest Charges which will not form part of the Revenue.</p>

<h2>11. DAMAGES &amp; SAFETY POLICY</h2>
<p><span class="pb">a)</span> avenaa.co.in will check the property every week. Damaged items will be repaired within 3 working days.</p>
<p><span class="pb">b)</span> ID proof required from guests at booking and check-in.</p>
<p><span class="pb">c)</span> avenaa.co.in caretaker will manage check-in, check-out, cleaning, kitchen, and guest attendance.</p>
<p><span class="pb">d)</span> Any guest damage is avenaa.co.in's responsibility to fix within 3 working days.</p>

<h2>avenaa.co.in OPERATIONAL RESPONSIBILITIES</h2>
<p><span class="pb">a)</span> Marketing and advertising, booking management, housekeeping, customer service, and managing electricity bills for the designated property.</p>

<h2>PATRON'S RESPONSIBILITIES</h2>
<p><span class="pb">a)</span> Provide property in good condition, fully furnished as per Annexure I checklist.</p>
<p><span class="pb">b)</span> Maintain property in safe, well-maintained condition. Promptly inform avenaa.co.in of repairs needed.</p>
<p><span class="pb">c)</span> Grant access to avenaa.co.in staff for inspections, repairs, and maintenance. Maintain appropriate insurance.</p>

<h2>9. TERMS AND TERMINATION</h2>
<p><span class="pb">a)</span> Agreement commences on the Effective Date and continues until terminated.</p>
<p><span class="pb">b)</span> Either party may terminate with minimum 1-month written notice.</p>
<p><span class="pb">c)</span> Termination procedure initiated within 7 days after confirmation from both parties.</p>
<p><span class="pb">e)</span> Violation by Patron governed by Sec 74, Indian Contract Act, 1872.</p>
<p><span class="pb">g)</span> avenaa.co.in is not engaged in any Illegal Activities. All guest entry/exit is documented.</p>
<p><span class="pb">h)</span> If Illegal Activities are carried out without knowledge of Property Patron, avenaa.co.in will be solely responsible. If activities are by Property Patron, Property Patron will be responsible.</p>

<h2>12. INDEMNITY</h2>
<p>The avenaa.co.in Patron shall indemnify and keep harmless avenaa.co.in against any claims, liabilities, damages, losses, and expenses arising from: (i) usage of Platform; (ii) breach of obligations; (iii) negligence; (iv) misrepresentations; (v) non-compliance of Applicable Laws; (vi) actions causing reputational harm.</p>

<h2>15. CONFIDENTIALITY</h2>
<p>Both Parties undertake not to disclose Confidential Information to any third party. This obligation survives termination. Breach governed by Section 27, Indian Contract Act, 1872 and Section 65, IT Act, 2000.</p>

<h2>16. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
<p>This Agreement shall be construed in accordance with the laws of India. Disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996. Seat of arbitration: Mumbai, Maharashtra.</p>

<h2>17. ENTIRE AGREEMENT</h2>
<p>This Agreement supersedes all previous correspondence, agreements, and understanding (whether oral or written) between the Parties.</p>

<p style="margin-top:14px;text-align:center;"><span class="pb">PLACE: MUMBAI &nbsp;&nbsp;&nbsp;&nbsp; DATE: ${today}</span></p>

<div class="sigs">
  <div class="sb">
    <p class="pb">BRISE HOSPITALITY MANAGEMENT</p>
    <p class="pb">PRIVATE LIMITED (avenaa.co.in)</p>
    <div class="sl"></div>
    <p><b>Mr. Hrithik Agarwal</b><br/>Director &nbsp;|&nbsp; DIN: 09186784</p>
  </div>
  <div class="sb" style="text-align:right;">
    <p class="pb">avenaa.co.in PATRON</p>
    ${property.signature_image ? `<img src="${property.signature_image}" class="sig-img"/>` : '<div style="height:56px;"></div>'}
    <div class="sl"></div>
    <p><b>${property.agreement_full_name}</b><br/>Owner<br/>
    Aadhaar: XXXX-XXXX-${property.aadhaar_last4}<br/>
    PAN: ${property.pan_number}<br/>
    Signed: ${signedOn}</p>
  </div>
</div>

<!-- ANNEXURE I -->
<div class="pg"></div>
<div class="hdr" style="margin-bottom:14px;">
  <img src="${process.env.OWNER_PORTAL_URL || 'http://localhost:3000'}/logo.png" class="logo" onerror="this.style.display='none'"/>
</div>
<h2 class="ul">Annexure – I: PATRON'S RESPONSIBILITIES CHECKLIST</h2>
<p>This checklist ensures all necessary items are in place. avenaa.co.in will facilitate timely replacements for any damaged items within 72 hours.</p>
<table style="margin-top:10px;">
  <tr><th>Area</th><th>Required Items</th></tr>
  <tr><td><b>Living Room</b></td><td>Sofa set, Television (TV), Coffee table, Dining table with crockery and dining set, Air conditioning (AC)</td></tr>
  <tr><td><b>Kitchen</b></td><td>Gas stove, Utensils, Water purifier, Refrigerator</td></tr>
  <tr><td><b>Bathroom</b></td><td>Geyser, Jet for cleaning, Western toilet, Shower, Bucket</td></tr>
  <tr><td><b>Rooms</b></td><td>Air conditioning (AC), Mirror, Ceiling fan, Night light</td></tr>
</table>

<!-- ANNEXURE II -->
<div class="pg"></div>
<div class="hdr" style="margin-bottom:14px;">
  <img src="${process.env.OWNER_PORTAL_URL || 'http://localhost:3000'}/logo.png" class="logo" onerror="this.style.display='none'"/>
</div>
<h2 class="ul">Annexure II: avenaa.co.in STANDARD OPERATING PROCEDURES</h2>
<p><span class="pb">Purpose:</span> To provide clear and consistent guidelines for avenaa.co.in Patron to ensure a smooth and efficient process.</p>
<p><span class="pb">Services offered by avenaa.co.in:</span></p>
<ul>
  <li>Convenient platform for individuals and businesses to browse, select, and rent spaces.</li>
  <li>Minimum rent guarantee — ensuring you will not pay more than lowest available market price.</li>
  <li>Unique 60% partnership amount assurance — you retain the majority of earnings.</li>
  <li>Service Level Agreements (SLA) defining service standards and performance measurement.</li>
  <li>No engagement in any Illegal Activities. All guest entry/exit documented and authorized.</li>
</ul>

</body></html>`;

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '16px', bottom: '20px', left: '0', right: '0' } });
  await browser.close();
  return pdfBuffer;
}

function fmt(d) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function words(num) {
  if (!num) return 'Zero';
  const o = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const t = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (num < 20) return o[num];
  if (num < 100) return t[Math.floor(num/10)]+(num%10?' '+o[num%10]:'');
  if (num < 1000) return o[Math.floor(num/100)]+' Hundred'+(num%100?' '+words(num%100):'');
  if (num < 100000) return words(Math.floor(num/1000))+' Thousand'+(num%1000?' '+words(num%1000):'');
  return words(Math.floor(num/100000))+' Lakh'+(num%100000?' '+words(num%100000):'');
}

module.exports = { generateAgreementPDF };
