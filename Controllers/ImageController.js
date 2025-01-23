const ImageCompress = require('../Models/ImageCompress'); // Import the model
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp'); // Import sharp for image compression

// Ensure the 'uploads' directory exists
const UPLOAD_DIR = 'uploads/';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({
    storage,
});

const ImageController = {
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No image file provided!' });
            }

            // Log original image size
            const originalFileSize = fs.statSync(req.file.path).size / 1024; // Size in KB
            console.log(`Original image size: ${originalFileSize.toFixed(2)} KB`);

            // Compress the uploaded image
            const compressedFilePath = `${UPLOAD_DIR}compressed-${req.file.filename}`;
            await sharp(req.file.path)
                .jpeg({ quality: 80 }) // Compress to 80% quality
                .toFile(compressedFilePath);

            // Log compressed image size
            const compressedFileSize = fs.statSync(compressedFilePath).size / 1024; // Size in KB
            console.log(`Compressed image size: ${compressedFileSize.toFixed(2)} KB`);

            // Delete the original file to save space
            fs.unlinkSync(req.file.path);

            // Save the compressed image to the database
            const newImage = new ImageCompress({
                profile: `compressed-${req.file.filename}`,
            });
            const savedImage = await newImage.save();

            return res.status(201).json({ success: true, message: 'Image uploaded and saved successfully!', data: savedImage });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error uploading image!', error: error.message });
        }
        /**
        #swagger.tags = ['ImageCompress']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['profile'] = { in: 'formData', type: 'file', required: true, accept: 'image/jpeg, image/png' }
         */
    },
};

module.exports = {
    uploadImage: ImageController.uploadImage,
    upload,
};
