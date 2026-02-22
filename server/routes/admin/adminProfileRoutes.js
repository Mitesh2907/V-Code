import express from "express";
import protect from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";
import {
  getAdminProfile,
  updateAdminProfile
} from "../../controllers/admin/adminProfileController.js";

const router = express.Router();

router.get("/me", protect, adminMiddleware, getAdminProfile);
router.put("/profile", protect, adminMiddleware, updateAdminProfile);

export default router;