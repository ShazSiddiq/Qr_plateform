import express from 'express';
import {
  register,
  sendOTP,
  verifyOTP,
  login,
  refreshToken,
  logout,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  otpValidation,
  verifyOtpValidation
} from '../middleware/validation.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/send-otp', otpLimiter, otpValidation, sendOTP);
router.post('/verify-otp', authLimiter, verifyOtpValidation, verifyOTP);
router.post('/login', authLimiter, loginValidation, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;