import express from "express";
import { getSystemOverview } from "../../controllers/admin/adminSystemController.js";
import protect from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/system", protect, adminMiddleware, getSystemOverview);

export default router;
