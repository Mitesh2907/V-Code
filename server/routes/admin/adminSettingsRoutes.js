import express from "express";
import protect from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";
import { changeAdminPassword } from "../../controllers/admin/adminSettingsController.js";

const router = express.Router();

router.put("/change-password", protect, adminMiddleware, changeAdminPassword);

export default router;