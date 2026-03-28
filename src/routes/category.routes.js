import express from "express";
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, restrictTo("admin"), createCategory);
router.put("/:id", protect, restrictTo("admin"), updateCategory);
router.delete("/:id", protect, restrictTo("admin"), deleteCategory);

export default router;