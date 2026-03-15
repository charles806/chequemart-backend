import { Router } from "express";
const router = Router();

import { register, registerVendor, login, logout, refreshToken, verifyEmail, forgotPassword, resetPassword, getMe, getBanks, resolveAccount } from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

//  Customer Registration 
router.post("/register", register);

//  Vendor Registration (includes Paystack subaccount creation) 
router.post("/register/vendor", registerVendor);

//  Login (email or phone + password) 
router.post("/login", login);

//  Token Management ─
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshToken);

//  Email Verification 
router.get("/verify-email", verifyEmail);

//  Password Reset 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

//  Paystack Bank Helpers (used in vendor registration form) 
router.get("/banks", getBanks);
router.post("/resolve-account", resolveAccount);

//  Current User Profile 
router.get("/me", protect, getMe);


// ════════════════════════════════════════════════════════════════════════════════
//  ⚠️  PHASE 2 ROUTES — DISABLED FOR MVP
//  Uncomment these when Phase 2 development begins.
//  Per PRD Section 8.2: Google OAuth and SMS are Phase 2 features.
// ════════════════════════════════════════════════════════════════════════════════

//  Google OAuth (Phase 2) 
// const passport = require("passport");
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
// router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }), googleCallback);

//  Phone OTP via SMS (Phase 2) 
// router.post("/send-otp", sendPhoneOTP);
// router.post("/verify-otp", verifyPhoneOTP);

export default router;