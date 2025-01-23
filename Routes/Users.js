const express = require('express');
const {
    createUser,
    login,
    getAllUsers,
    updateUser,
    changeUserStatus,
    upload,
} = require('../Controllers/UsersControllers');
const verifyToken = require('../Middleware/VerifyToken'); // Middleware for token authentication
const Authentication = require('../Middleware/Authentication'); //authentication for user
const router = express.Router();

// Public Routes
router.post('/signup', verifyToken, Authentication, upload.single('profile_pic'), createUser); // Create a new user
router.post('/login', login); // Login OTP
router.get('/getUsers', verifyToken, Authentication, getAllUsers); // Login OTP
router.put('/updateUser', verifyToken, Authentication, upload.single('profile_pic'), updateUser); // updateUser
router.patch('/changeStatus', verifyToken, Authentication, changeUserStatus); // updateUser
module.exports = router;

