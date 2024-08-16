const express = require('express');
const router = express.Router();
const { initiateForgotPassword, verifyOTP, updatePassword,resendOTP,getOtpExpiry } = require('../controllers/authController');

router.post('/forgot-password', initiateForgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/update-password', updatePassword);
router.post('/resend-otp', resendOTP);


module.exports = router;
