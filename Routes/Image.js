const express = require('express');
const { uploadImage, upload } = require('../Controllers/ImageController');
const router = express.Router();

// Route for uploading an image
router.post('/upload-image', upload.single('profile'), uploadImage);

module.exports = router;
