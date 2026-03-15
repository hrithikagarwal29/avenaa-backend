const router = require('express').Router();
const pool   = require('../models/db');

router.post('/:token/accept', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT stage FROM properties WHERE token=$1', [req.params.token]);
    if (!rows.length) return res.status(404).json({ error: 'Invalid link.' });
    if (rows[0].stage !== 3) return res.status(400).json({ error: 'Not at offer stage.' });
    await pool.query(`UPDATE properties SET stage=4,status='kyc_pending' WHERE token=$1`, [req.params.token]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/:token/submit', async (req, res) => {
  try {
    const { owner_name, owner_phone, owner_email, aadhaar_front_url, aadhaar_back_url, pan_url,
            bank_account_name, bank_account_no, bank_ifsc, bank_name, property_doc_url, noc_doc_url } = req.body;
    const { rows } = await pool.query('SELECT stage FROM properties WHERE token=$1', [req.params.token]);
    if (!rows.length) return res.status(404).json({ error: 'Invalid link.' });
    if (rows[0].stage !== 4) return res.status(400).json({ error: 'KYC not available at this stage.' });
    await pool.query(
      `UPDATE properties SET owner_name=$1,owner_phone=$2,owner_email=$3,aadhaar_front_url=$4,aadhaar_back_url=$5,pan_url=$6,bank_account_name=$7,bank_account_no=$8,bank_ifsc=$9,bank_name=$10,property_doc_url=$11,noc_doc_url=$12,stage=5,status='agreement_pending' WHERE token=$13`,
      [owner_name, owner_phone, owner_email, aadhaar_front_url, aadhaar_back_url, pan_url,
       bank_account_name, bank_account_no, bank_ifsc, bank_name, property_doc_url, noc_doc_url, req.params.token]
    );
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
