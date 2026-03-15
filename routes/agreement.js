const router = require('express').Router();
const pool   = require('../models/db');
const { generateAgreementPDF } = require('../utils/generatePDF');

// POST /api/agreement/:token/sign
// Receives form data + base64 draw signature → generates PDF → saves → stage 6
router.post('/:token/sign', async (req, res) => {
  try {
    const { agreement_full_name, agreement_dob, agreement_address, aadhaar_last4, pan_number, signature_image } = req.body;

    if (!signature_image || signature_image === 'data:,' ) {
      return res.status(400).json({ error: 'Signature is required. Please draw your signature.' });
    }

    const { rows } = await pool.query('SELECT * FROM properties WHERE token=$1', [req.params.token]);
    if (!rows.length) return res.status(404).json({ error: 'Invalid link.' });
    const property = rows[0];
    if (property.stage !== 5) return res.status(400).json({ error: 'Agreement not available at this stage.' });

    const fullProperty = {
      ...property,
      agreement_full_name,
      agreement_dob,
      agreement_address,
      aadhaar_last4,
      pan_number,
      signature_image,
      signed_at: new Date(),
    };

    // Generate PDF with embedded signature
    const pdfBuffer = await generateAgreementPDF(fullProperty);
    const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

    // Save everything to DB
    await pool.query(
      `UPDATE properties SET
        agreement_full_name=$1, agreement_dob=$2, agreement_address=$3,
        aadhaar_last4=$4, pan_number=$5, signature_image=$6,
        agreement_pdf_url=$7, signed_at=NOW(), agreement_accepted=TRUE,
        stage=6, status='onboarded'
       WHERE token=$8`,
      [agreement_full_name, agreement_dob, agreement_address,
       aadhaar_last4, pan_number, signature_image, pdfBase64, req.params.token]
    );

    res.json({ success: true, pdfUrl: pdfBase64 });
  } catch (err) {
    console.error('Sign error:', err);
    res.status(500).json({ error: 'Failed to process: ' + err.message });
  }
});

// GET /api/agreement/:token/status
router.get('/:token/status', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT stage, status, signed_at, agreement_pdf_url FROM properties WHERE token=$1',
      [req.params.token]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
