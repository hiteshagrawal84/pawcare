const multer = require('multer');
const path = require('path');
const { AppError } = require('../utils/errors');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|pdf|svg/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype.split('/')[1]) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (ext || mime) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Allowed: images, videos, PDF', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024 },
});

module.exports = { upload };
