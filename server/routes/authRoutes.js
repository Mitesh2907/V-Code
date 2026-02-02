import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// public
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 PROTECTED (THIS LINE IS CRITICAL)
router.get("/me", authMiddleware, getCurrentUser);

export default router;
