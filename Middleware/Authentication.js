const Admin = require('../Models/Admin');

const Admins = async (req, res, next) => {
    try {
        const userId = req.user; // Make sure `req.decode` contains the user ID
        const admin = await Admin.findById(userId.id); // Find admin in the database
        if (admin.role === 'Admin') {
            next(); // If the user is an admin, allow the request to continue
        } else {
            res.status(403).json({ message: "Access Denied, Admin only Access!" }); // Deny access if not an admin
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" }); // Handle any errors that occur during the process
    }
};

module.exports = Admins;
