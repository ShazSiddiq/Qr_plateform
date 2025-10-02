import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import sendMail from '../utils/nodeMailer.js';
// import { handleEmailOtp, handlePhoneOtp } from '../utils/sendOTP.js';
import { generateOTP } from '../utils/validators.js';


const { SMS_API_URL, SMS_USER, SMS_PASSWORD, SENDER_ID, TemplateID } = process.env;


// Function to generate OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// function for phone otp
const handlePhoneOtp = async (phone) => {
    const otp = generateOtp();
    // const hashedOtp = await bcrypt.hash(otp, 10);

    await OtpVerification.findOneAndUpdate(
        { phoneNumber: phone },
        { otp: otp, otpExpires: Date.now() + 15 * 60 * 1000 ,isOtpVerified:false},
        { upsert: true, new: true }
    );

    const smsMessage = `Dear user, ${otp} is your OTP. Valid for 15 min only and do not share with anyone - INNOBLES`;

    const smsParams = new URLSearchParams({
        User: SMS_USER,
        passwd: SMS_PASSWORD,
        MobileNumber: phone,
        Message: smsMessage,
        SID: SENDER_ID,
        mType: "N",
        DR: "Y",
        TemplateID,
    });

    await axios.post(SMS_API_URL, smsParams.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Phone OTP sent:", otp);
    return otp;
};

//function for email otp
const handleEmailOtp = async (email) => {
    const otp = generateOtp();
    // const hashedOtp = await bcrypt.hash(otp, 10);

    const subject = "Otp verification for Innobles Smart Technologies";
    const mailContent = `
                       <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.6; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                     <h2 style="color: #d32f2f; text-align: center;">🔐 OTP Verification</h2>

                        <p>Dear User,</p>

                        <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>

                        <div style="font-size: 22px; font-weight: bold; color: #d32f2f; text-align: center; margin: 20px 0;">
                               ${otp}
                       </div>

                        <p>This OTP is valid for <strong>15 minutes</strong> and should not be shared with anyone for security reasons.</p>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

                       <p>If you did not request this OTP or need further assistance, please contact our support team.</p>

                       <p style="margin-top: 30px;">
                       Best regards, <br>
                       🏢 <strong>Innobles Smart Technologies</strong> <br>
                        ✉️ <a href="mailto:support@innobles.com" style="text-decoration: none; color: #333;">support@innobles.com</a>
                       </p>
                       </div>
                    `;


    const mailSent = await sendMail(email, subject, mailContent);
    if (!mailSent) ApiResponse(res, 500, "Email OTP sending failed");

    console.log("Email OTP sent:", otp);
    return otp;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, loginMethod } = req.body;

    // Check if user already exists
    const existingUser = loginMethod === 'email' 
      ? await User.findOne({ email })
      : await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with this ${loginMethod} already exists`
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: loginMethod === 'email' ? email : undefined,
      phone: loginMethod === 'phone' ? phone : undefined,
      password,
      loginMethod
    });

    // Send verification OTP
    const otp = generateOTP();
    await OTP.create({
      identifier: loginMethod === 'email' ? email : phone,
      otp,
      type: loginMethod
    });

    if (loginMethod === 'email') {
      await handleEmailOtp(email, otp, name);
    } else {
      await handlePhoneOtp(phone, otp);
    }

    res.status(201).json({
      success: true,
      message: `Verification OTP sent to your ${loginMethod}`,
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP for login
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res, next) => {
  try {
    const { identifier, type } = req.body;

    // Find user
    const user = type === 'email'
      ? await User.findOne({ email: identifier })
      : await User.findOne({ phone: identifier });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete any existing unverified OTPs
    await OTP.deleteMany({ identifier, verified: false });

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.create({ identifier, otp, type });

    // Send OTP
    if (type === 'email') {
      await handleEmailOtp(identifier, otp, user.name);
    } else {
      await handlePhoneOtp(identifier, otp);
    }

    res.json({
      success: true,
      message: `OTP sent to your ${type}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body;

    // Find OTP
    const otpDoc = await OTP.findOne({
      identifier,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Find user and update verification status
    const user = otpDoc.type === 'email'
      ? await User.findOne({ email: identifier })
      : await User.findOne({ phone: identifier });

    user.isVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login with password
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};