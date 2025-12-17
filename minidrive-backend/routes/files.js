const express = require('express');
const router = express.Router();
const {
  getFiles,
  uploadFile,
  deleteFile,
  downloadFile,
} = require('../controllers/filesController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route('/').get(getFiles).post(upload.single('file'), uploadFile);

router.route('/:id').delete(deleteFile).get(downloadFile);

module.exports = router;