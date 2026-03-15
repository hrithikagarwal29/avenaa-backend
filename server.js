const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    process.env.OWNER_PORTAL_URL || 'http://localhost:3000',
    process.env.ADMIN_PANEL_URL  || 'http://localhost:3001',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/property',  require('./routes/property'));
app.use('/api/kyc',       require('./routes/kyc'));
app.use('/api/agreement', require('./routes/agreement'));
app.use('/api/admin',     require('./routes/admin'));
app.use('/api/upload',    require('./routes/upload'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', project: 'Avenaa Onboarding', time: new Date() }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Avenaa API running on port ${PORT}`));
