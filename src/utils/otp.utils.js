import bcrypt from "bcryptjs";
import twilio from "twilio";

// Initialize Twilio client with credentials from .env
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/**
 * generateOTP
 * Generates a random 6-digit OTP as a string.
 * @returns {string} 6-digit OTP e.g. "482910"
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * hashOTP
 * Hashes a plain OTP before storing in the database.
 * @param {string} otp - Plain 6-digit OTP
 * @returns {string} Hashed OTP
 */
const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
};

/**
 * verifyOTP
 * Compares a plain OTP against the stored hashed OTP.
 * @param {string} enteredOTP - OTP entered by user
 * @param {string} hashedOTP  - Stored hashed OTP from DB
 * @returns {boolean} True if match
 */
const verifyOTP = async (enteredOTP, hashedOTP) => {
  return await bcrypt.compare(enteredOTP, hashedOTP);
};

/**
 * sendOTPviaSMS
 * Sends a 6-digit OTP to a phone number via Twilio SMS.
 * @param {string} phone - Recipient's phone number (E.164 format, e.g. +2348012345678)
 * @param {string} otp   - Plain 6-digit OTP to send
 * @returns {object} Twilio message response
 */
const sendOTPviaSMS = async (phone, otp) => {
  const message = await twilioClient.messages.create({
    body: `Your Chequemart verification code is: ${otp}. It expires in 10 minutes. Do not share this code.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  return message;
};

/**
 * getOTPExpiry
 * Returns a Date object 10 minutes from now.
 * Used to set OTP expiry in the database.
 * @returns {Date}
 */
const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

export { generateOTP, hashOTP, verifyOTP, sendOTPviaSMS, getOTPExpiry };
