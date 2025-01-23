const Admin = require('../Models/Admin'); // Import Admin model
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables
const { JWT_SECRET, SALT_ROUNDS } = process.env;

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({
    storage,
});

const AdminController = {
    // Create a new admin
    async createAdmin(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Check if email already exists
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS, 10));

            const newAdmin = new Admin({
                name,
                email,
                password: hashedPassword,
                profile_pic: req.file ? req.file.filename : null, // Save uploaded file name if available
                role,
                status: true, // Default status is active
            });

            await newAdmin.save();
            return res.status(201).json({ success: true, message: 'Admin created successfully', data: newAdmin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['password'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['status'] = { in: 'formData', type: 'string', required: true ,enum: ['true','false'],default : 'true'}
        #swagger.parameters['role'] = { in: 'formData', type: 'string', required: true, enum: ['Superadmin', 'Admin'], default:'Admin'}
         */
    },

    // Admin login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({ success: false, message: 'Email not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({ success: true, message: 'Login successful', role: admin.role, token });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
        */
    },

    // Update an admin
    async updateAdmin(req, res) {
        try {
            const { id } = req.body;
            const { name, email, role, status, password } = req.body;

            // Find the user by ID
            const admin = await Admin.findById(id);

            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            //update fields dynamically
            if (name) admin.name = name;
            if (email) admin.email = email;
            if (role) admin.role = role;
            if (status) admin.status = status;
            if (password) admin.password = password;

            // Add profile picture if uploaded
            if (req.file) {
                admin.profile_pic = req.file.filename;
            }

            // Save the updated admin
            await admin.save();
            return res.status(200).json({ success: true, message: 'Admin updated successfully', data: admin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false }
        #swagger.parameters['email'] = { in: 'formData', type: 'string', required: false }
        #swagger.parameters['password'] = { in: 'formData', type: 'string', required: false }
        #swagger.parameters['status'] = { in: 'formData', type: 'string', required: false ,enum: ['true','false'],default : 'true'}
        #swagger.parameters['role'] = { in: 'formData', type: 'string', required: false, enum: ['Superadmin', 'Admin'], default:'Admin'}
        #swagger.parameters['id'] = { in: 'formData', type: 'string', required: true }
        */
    },

    // Retrieve all admins with validations, pagination, and name-based search
    async getAdmins(req, res) {
        try {
            const { page = 1, limit = 10, status, role, name, email } = req.query;

            // Validate page and limit (ensure they are positive integers)
            if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
                return res.status(400).json({
                    success: false,
                    message: 'Page and limit must be positive integers'
                });
            }

            const query = {};

            // Add filters for status 
            if (status !== undefined) {
                query.status = status === 'true';
            }

            // Add filters for  role
            if (role) {
                query.role = role;
            }

            // Add filters for email
            if (email) {
                query.email = email;
            }

            // Optional: Add name-based search (case-insensitive partial match)
            if (name) {
                query.name = { $regex: name, $options: 'i' }; // 'i' for case-insensitive search
            }

            // Calculate skip and limit for pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Retrieve admins based on filters and pagination
            const admins = await Admin.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }); // Optional: Sort by createdAt in descending order

            // Get total count for pagination metadata
            const totalAdmins = await Admin.countDocuments(query);

            return res.status(200).json({
                success: true,
                message: 'Admins retrieved successfully.',
                data: admins,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalAdmins / limit),
                    totalRecords: parseInt(totalAdmins / limit),
                    limit: parseInt(limit),
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
        */
    },

    // Change admin status
    async changeStatus(req, res) {
        try {
            const { id } = req.query;

            // Find the admin by ID
            const admin = await Admin.findById(id);

            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            // Toggle the status
            admin.status = !admin.status;

            // Save the updated admin
            await admin.save();

            return res.status(200).json({ success: true, message: 'Status updated successfully', data: admin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
        */

    },

    // Retrieve a specific admin by ID
    async getAdminById(req, res) {
        try {
            const { id } = req.params;
            const admin = await Admin.findById(id);

            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }

            return res.status(200).json({ success: true, data: admin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
        */
    },

    // Delete an admin
    async deleteAdmin(req, res) {
        try {
            const { id } = req.params;

            const deletedAdmin = await Admin.findByIdAndDelete(id);

            if (!deletedAdmin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }

            return res.status(200).json({ success: true, message: 'Admin deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Admin']
         */
    },


};

module.exports = {
    createAdmin: AdminController.createAdmin,
    getAdmins: AdminController.getAdmins,
    getAdminById: AdminController.getAdminById,
    updateAdmin: AdminController.updateAdmin,
    deleteAdmin: AdminController.deleteAdmin,
    changeStatus: AdminController.changeStatus,
    login: AdminController.login,
    upload,

}