const router = require('express').Router();
const pool   = require('../models/db');

router.get('/:token', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM properties WHERE token=$1', [req.params.token]);
    if (!rows.length) return res.status(404).json({ error: 'Invalid or expired link.' });
    const p = { ...rows[0] };
    delete p.signature_image;
    res.json(p);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/:token/submit', async (req, res) => {
  try {
    const { property_name, property_type, city, address, area_sqft, expected_rent, amenities, photos } = req.body;
    const { rows } = await pool.query('SELECT stage FROM properties WHERE token=$1', [req.params.token]);
    if (!rows.length) return res.status(404).json({ error: 'Invalid link.' });
    if (rows[0].stage > 1) return res.status(400).json({ error: 'Already submitted.' });
    await pool.query(
      `UPDATE properties SET property_name=$1,property_type=$2,city=$3,address=$4,area_sqft=$5,expected_rent=$6,amenities=$7,photos=$8,stage=2,status='under_review' WHERE token=$9`,
      [property_name, property_type, city, address, area_sqft, expected_rent, amenities, photos, req.params.token]
    );
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
