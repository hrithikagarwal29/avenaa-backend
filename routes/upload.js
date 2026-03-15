const router = require('express').Router();
const { uploadPhotos, uploadKYC } = require('../utils/cloudinary');

router.post('/photos', (req, res) => {
  uploadPhotos(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, urls: req.files.map(f => f.path) });
  });
});

router.post('/kyc', (req, res) => {
  uploadKYC(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, url: req.file.path });
  });
});

module.exports = router;
