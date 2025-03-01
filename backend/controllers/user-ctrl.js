const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../utils/email");
const logger = require("../utils/logger");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    logger.info(`Registration attempt for user: ${email}`);

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      logger.warn(`Registration failed - User already exists: ${email}`);
      return res.status(400).json({
        success: false,
        message: "User already exists with the same name or email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`, { error: err });
    res.status(500).json({ success: false, message: "Registration Failed" });
  }
};

const initiateLogin = async (req, res) => {
  try {
    const { email } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed - User not found with email: ${email}`);
      return res.status(404).json({ 
        success: false, 
        message: "User not found with this email" 
      });
    }


    const otp = generateOTP();
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5); 

    user.otp = {
      code: otp,
      expiresAt: otpExpiryTime
    };
    await user.save();
    logger.info(`OTP generated for user: ${user.name} with email: ${email}`);

    const emailSent = await sendOTP(user.email, otp);
    if (!emailSent) {
      logger.error(`Failed to send OTP email to: ${user.email}`);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP" 
      });
    }
    
    logger.info(`OTP sent successfully to: ${user.email}`);
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      userId: user._id
    });

  } catch (err) {
    logger.error(`Login initiation error: ${err.message}`, { error: err });
    res.status(500).json({ 
      success: false, 
      message: err.message || "Login initiation failed" 
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    logger.info(`OTP verification attempt for user ID: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`OTP verification failed - User not found: ${userId}`);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    if (!user.otp.code || !user.otp.expiresAt || new Date() > user.otp.expiresAt) {
      logger.warn(`OTP verification failed - Expired OTP for user: ${user.name}`);
      return res.status(401).json({ 
        success: false, 
        message: "OTP has expired" 
      });
    }

    if (user.otp.code !== otp) {
      logger.warn(`OTP verification failed - Invalid OTP for user: ${user.name}`);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid OTP" 
      });
    }

    user.otp = {
      code: null,
      expiresAt: null
    };
    await user.save();
    
    const accessToken = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    logger.info(`User logged in successfully: ${user.name}`);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    logger.error(`OTP verification error: ${err.message}`, { error: err });
    res.status(500).json({ 
      success: false, 
      message: err.message || "OTP verification failed" 
    });
  }
};

module.exports = {
  registerUser,
  initiateLogin,
  verifyOTP
};