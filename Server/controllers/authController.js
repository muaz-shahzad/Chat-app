// controllers/forgotPasswordController.js

const User = require('../models/userModel');
const UserOTP = require('../models/UserOTP');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Function to generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP via email
async function sendOTP(email, otp) {
    // Configure nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Email content
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. This OTP will expire in 30 seconds.`
    };

    // Send email
    await transporter.sendMail(mailOptions);
}

// Controller methods
const authController = {
    async initiateForgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Check if email exists in User model
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Generate OTP
            const otp = generateOTP();

            // Find existing user OTP record or create a new one
            let userOTP = await UserOTP.findOne({ email });

            if (!userOTP) {
                // Create a new record if userOTP doesn't exist
                userOTP = new UserOTP({
                    email,
                    otp
                });
            } else {
                // Update existing user OTP record
                userOTP.otp = otp;
            }

            // Save or update user OTP record
            await userOTP.save();

            // Send OTP to user's email
            await sendOTP(email, otp);

            return res.status(200).json({ message: 'OTP sent to your email.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    },

    async verifyOTP(req, res) {
        const { email, enteredOTP } = req.body;

        try {
            // Find user OTP record in the database
            const userOTP = await UserOTP.findOne({ email });

            if (!userOTP) {
                return res.status(400).json({ message: 'OTP expired or not generated.' });
            }

            if (enteredOTP !== userOTP.otp.toString()) {
                return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
            }

            

            return res.status(200).json({ message: 'OTP Verified.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    },

    async updatePassword(req, res) {
        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user's password
            user.password = hashedPassword;
            await user.save();

            // Optionally: Remove OTP from the database if necessary
            await UserOTP.findOneAndDelete({ email });

            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    },

    async resendOTP(req, res) {
        const { email } = req.body;

        try {
            // Check if email exists in User model
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Generate new OTP
            const otp = generateOTP();

            // Find existing user OTP record or create a new one
            let userOTP = await UserOTP.findOne({ email });

            if (!userOTP) {
                // Create a new record if userOTP doesn't exist
                userOTP = new UserOTP({
                    email,
                    otp
                });
            } else {
                // Update existing user OTP record
                userOTP.otp = otp;
            }

            // Save or update user OTP record
            await userOTP.save();

            // Send OTP to user's email
            await sendOTP(email, otp);

            return res.status(200).json({ message: 'New OTP sent to your email.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    },


   
};

module.exports = authController;
