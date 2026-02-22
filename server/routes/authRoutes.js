import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  changePassword,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// public
router.post("/register", registerUser);
router.post("/login", loginUser);


// 🔐 PROTECTED (THIS LINE IS CRITICAL)
router.get("/me", authMiddleware, getCurrentUser);
router.put("/change-password", authMiddleware, changePassword);
router.put("/update-profile", authMiddleware, updateProfile);


export default router;
