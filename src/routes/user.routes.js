import { Router } from "express";
const router = Router();

import multer from "multer";
import { 
  getProfile, 
  updateProfile, 
  uploadAvatar, 
  deleteAvatar,
  changePassword 
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

// Configure multer for memory storage (file handled in controller)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  },
});

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum 2MB allowed.',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// ────────────────────────────────────────────────────────────────
// User Routes - All protected (require authentication)
// ────────────────────────────────────────────────────────────────

// GET /api/users/profile - Get current user profile
router.get("/profile", protect, getProfile);

// PUT /api/users/profile - Update user profile
router.put("/profile", protect, updateProfile);

// POST /api/users/avatar - Upload avatar image
router.post("/avatar", protect, upload.single("avatar"), handleMulterError, uploadAvatar);

// DELETE /api/users/avatar - Delete avatar image
router.delete("/avatar", protect, deleteAvatar);

// PUT /api/users/password - Change password
router.put("/password", protect, changePassword);

export default router;
