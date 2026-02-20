import express from "express";
import protect from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

import {
  getAllUsers,
  toggleBlockUser,
  deleteUser
} from "../../controllers/admin/adminUserController.js";

const router = express.Router();

/* =========================
   ADMIN USERS ROUTES
========================= */

// GET ALL USERS
router.get("/", protect, adminMiddleware, getAllUsers);

// TOGGLE BLOCK / UNBLOCK
router.put("/toggle/:id", protect, adminMiddleware, toggleBlockUser);

// DELETE USER
router.delete("/:id", protect, adminMiddleware, deleteUser);

export default router;
