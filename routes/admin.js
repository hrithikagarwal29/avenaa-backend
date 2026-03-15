const router    = require('express').Router();
const pool      = require('../models/db');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const auth      = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { generateToken } = require('../utils/generateLink');
const { sendLoginCredentials } = require('../utils/mailer');

const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 10 });

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email=$1', [email.toLowerCase().trim()]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials.' });
    if (!await bcrypt.compare(password, rows[0].password)) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email, name: rows[0].name, role: rows[0].role },
      process.env.JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, admin: { name: rows[0].name, email: rows[0].email, role: rows[0].role } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/properties', auth, async (req, res) => {
  try {
    const stage = req.query.stage;
    let q = 'SELECT id,token,stage,status,property_name,city,expected_rent,approved_rent,sales_target,owner_name,owner_email,created_at,signed_at FROM properties';
    let p = [];
    if (stage) { q += ' WHERE stage=$1'; p.push(stage); }
    q += ' ORDER BY created_at DESC LIMIT 200';
    const { rows } = await pool.query(q, p);
    res.json({ properties: rows });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/properties/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM properties WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const p = { ...rows[0] };
    delete p.signature_image; // don't send signature in listing
    res.json(p);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/properties/:id/approve', auth, async (req, res) => {
  try {
    const { approved_rent, go_live_date, sales_target, admin_notes } = req.body;
    if (!approved_rent || !go_live_date) return res.status(400).json({ error: 'approved_rent and go_live_date are required.' });
    await pool.query(
      `UPDATE properties SET approved_rent=$1,go_live_date=$2,sales_target=$3,admin_notes=$4,stage=3,status='offer_sent',approved_by=$5,approved_at=NOW() WHERE id=$6`,
      [approved_rent, go_live_date, sales_target || 0, admin_notes || '', req.admin.id, req.params.id]
    );
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/generate-link', auth, async (req, res) => {
  try {
    const token = generateToken();
    await pool.query('INSERT INTO properties (token,stage,status) VALUES ($1,1,$2)', [token, 'link_generated']);
    const link = `${process.env.OWNER_PORTAL_URL}/start/${token}`;
    const waMsg = `Hello! Please complete your property onboarding with Avenaa using this secure link:\n${link}\n\n— Avenaa Team (avenaa.co.in)`;
    res.json({ token, link, whatsappUrl: `https://wa.me/?text=${encodeURIComponent(waMsg)}` });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/send-credentials', auth, async (req, res) => {
  try {
    await sendLoginCredentials(req.body);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed to send: ' + e.message }); }
});

// Run ONCE to create first admin — then this route stays but is protected by secret
router.post('/create', async (req, res) => {
  try {
    const { email, password, name, secret } = req.body;
    if (secret !== 'AVENAA_ADMIN_SETUP_2024') return res.status(403).json({ error: 'Unauthorized.' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admin_users (email,password,name) VALUES ($1,$2,$3)', [email.toLowerCase(), hash, name]);
    res.json({ success: true, message: 'Admin user created.' });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Email already exists.' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
