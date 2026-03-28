import express from "express";
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from "../controllers/product.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/my-products", protect, getMyProducts);
router.get("/:id", getProductById);

router.post("/", protect, restrictTo("admin", "seller"), createProduct);
router.put("/:id", protect, restrictTo("admin", "seller"), updateProduct);
router.delete("/:id", protect, restrictTo("admin", "seller"), deleteProduct);

export default router;
