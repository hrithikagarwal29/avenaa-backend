const cloudinary = require('cloudinary').v2;
const multer     = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avenaa/property-photos',
    allowed_formats: ['jpg','jpeg','png','webp'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

const kycStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'avenaa/kyc-docs', allowed_formats: ['jpg','jpeg','png','pdf'], resource_type: 'auto' },
});

const uploadPhotos = multer({ storage: photoStorage, limits: { fileSize: 10 * 1024 * 1024 } }).array('photos', 10);
const uploadKYC    = multer({ storage: kycStorage,   limits: { fileSize: 10 * 1024 * 1024 } }).single('file');

module.exports = { uploadPhotos, uploadKYC };
