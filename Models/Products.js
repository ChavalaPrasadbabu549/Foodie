const mongoose = require('mongoose');

// Define Product Schema
const ProductSchema = mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        Description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: false,
        },
        image: {
            type: String, // Store image URL or path to the image file
            required: true, // Optional, depending on your needs
        },
        category: {
            type: String,
            required: false, // Optional: You can use enums if you want to define categories
            enum: ['Bakery', 'Sweeteners', 'Foods'], // Example categories
        },
        stockQuantity: {
            type: Number,
            required: false,
            default: 0, // Default to 0 stock if not specified
        },
        status: {
            type: Boolean,
            default: true, // Default status is active
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create and export Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
