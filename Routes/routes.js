const express = require('express');
const router = express.Router();

// Importing the Admin and Products routers
const adminRoutes = require('../Routes/Admin'); // Assuming your admin routes are in adminRoutes.js
const productRoutes = require('../Routes/Products'); // Assuming your product routes are in productRoutes.js
const userRoutes = require('../Routes/Users'); // Assuming your product routes are in userRoutes.js
const imageRoutes = require('../Routes/Image'); // Assuming your Image routes are in imageRoutes.js

// Admin routes
router.use('/Admin', adminRoutes);
// Product routes
router.use('/Products', productRoutes);
// User routes
router.use('/Users', userRoutes);
//imageRoutes
router.use('/api', imageRoutes);

module.exports = router;
