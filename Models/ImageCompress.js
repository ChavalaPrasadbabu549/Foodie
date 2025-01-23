const mongoose = require('mongoose');

// Define schema for image compression
const ImageCompressSchema = new mongoose.Schema(
    {
        profile: {
            type: String,
            required: true, // Ensure the profile image is required
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create and export the model
const ImageCompress = mongoose.model('ImageCompress', ImageCompressSchema);
module.exports = ImageCompress;
