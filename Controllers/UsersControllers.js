const User = require('../Models/Users'); // Import User model
const multer = require('multer');
const jwt = require('jsonwebtoken');


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

// Generate a random 6-digit OTP (default is 0000 for now)
const generateOTP = () => {
    return '0000'; // Static OTP for testing, update logic for production
};



const UsersControllers = {
    // Create a new User with OTP
    async createUser(req, res) {
        try {
            const { name, mobile, email, dob, location, gender } = req.body;

            // Ensure dob is converted to a valid Date format
            const formattedDob = dob ? new Date(dob) : null;

            // Check if email or mobile already exists
            const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Mobile number or Email already exists' });
            }

            // Generate OTP
            const otp = generateOTP(); // Static OTP for testing, can be dynamic in production

            // Create new user
            const newUser = new User({
                name,
                email,
                mobile,
                profile_pic: req.file ? req.file.filename : null, // Save uploaded file name if available
                dob: formattedDob,
                location,
                gender,
                otp,
            });

            await newUser.save();
            return res.status(201).json({ success: true, message: 'User created successfully.', data: newUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['User']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['mobile'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['dob'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['location'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['gender'] = { in: 'formData', type: 'string', required: true, enum: ['Male', 'Female'], default:'Male'}
        */
    },

    // Login with mobile and OTP
    async login(req, res) {
        try {
            const { mobile, otp } = req.body;

            // Validate input
            if (!mobile || !otp) {
                return res.status(400).json({ success: false, message: 'Mobile number and OTP are required.' });
            }

            // Find user by mobile
            const user = await User.findOne({ mobile });

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            // Validate OTP
            if (user.otp !== otp) {
                return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
            }

            // Respond with user details
            return res.status(200).json({ success: true, message: 'Login successful.', data: user, token: token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
       #swagger.tags = ['User']
       */
        
    },

    // Get all users
    async getAllUsers(req, res) {
        try {
            // Retrieve all users from the database
            const users = await User.find();

            // Respond with user data
            return res.status(200).json({ success: true, message: 'Users retrieved successfully.', data: users });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
       #swagger.tags = ['User']
       */
    },

    //updateuser
    async updateUser(req, res) {
        try {
            const { id } = req.body; // Extract User ID from request body (not params)
            const { name, mobile, email, dob, location, gender } = req.body; // Extract fields from request body

            // Validate and format dob if provided
            const formattedDob = dob ? new Date(dob) : undefined;

            // Find the user by ID
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Update fields dynamically
            if (name) user.name = name;
            if (mobile) user.mobile = mobile;
            if (email) user.email = email;
            if (formattedDob) user.dob = formattedDob;
            if (location) user.location = location;
            if (gender) user.gender = gender;

            // Add profile picture if uploaded
            if (req.file) {
                user.profile_pic = req.file.filename;
            }

            // Save the updated user
            await user.save();

            return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

        /**
      #swagger.tags = ['User']
      #swagger.autoBody = false
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
      #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['mobile'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['email'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['dob'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['location'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['gender'] = { in: 'formData', type: 'string', required: false, enum: ['Male', 'Female'], default:'Male'}
      #swagger.parameters['id'] = { in: 'formData', type: 'string', required: false }
      */
    },

    // Change status
    async changeUserStatus(req, res) {
        try {
            // Extract user ID from the request body
            const { id } = req.query;
            // Find user by ID
            const users = await User.findById(id);
            if (!users) {
                return res.status(404).json({ success: false, message: "User not found." });
            }

            // Toggle the user's status
            users.status = !users.status;

            // Save the updated user status
            await users.save();

            // Respond with success message
            return res.status(200).json({ success: true, message: "User status updated successfully", data: users });
        } catch (error) {
            // Handle any errors
            return res.status(500).json({ success: false, message: "Server error.", error: error.message });
        }
        /**
       #swagger.tags = ['User']
       */

    },
};

module.exports = {
    createUser: UsersControllers.createUser,
    login: UsersControllers.login,
    getAllUsers: UsersControllers.getAllUsers,
    updateUser: UsersControllers.updateUser,
    changeUserStatus: UsersControllers.changeUserStatus,
    upload,
}
