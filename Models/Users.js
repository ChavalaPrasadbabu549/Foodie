const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String, // URL or path for the profile picture
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true, // Ensures mobile number is unique
        },
        dob: {
            type: Date,
            required: false,
            unique: true, // Ensures dob is unique
        },
        location: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },
        otp: {
            type: String, // OTP sent to the user
            required: true, // Make OTP required for new users
        },
        status: {
            type: Boolean,
            default: true, // Default status is inactive until OTP verification
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const User = mongoose.model('Users', UserSchema);
module.exports = User;
