const express = require('express');
const {
    login,
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changeStatus,
    upload
} = require('../Controllers/AdminControllers');
const verifyToken = require('../Middleware/VerifyToken'); // Middleware for token authentication
const Authentication = require('../Middleware/Authentication'); //authentication for user
const router = express.Router();


// Public Route (Admin login)
router.post('/signup', verifyToken, Authentication, upload.single('profile_pic'), createAdmin); // Create new admin
router.post('/login', login);// Protected Routes (Requires token authentication)
router.get('/getadmins', verifyToken, Authentication, getAdmins); // Get all admins
router.get('/admins/:id', verifyToken, Authentication, getAdminById); // Get admin by ID
router.put('/updateAdmin', verifyToken, Authentication, upload.single('profile_pic'), updateAdmin); // Update admin details
router.delete('/delete/:id', verifyToken, Authentication, deleteAdmin); // Delete admin
router.patch('/status', verifyToken, Authentication, changeStatus); // Change admin status

module.exports = router;
