import express from "express";
import protect from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

import {
  getAllRooms,
  toggleRoomStatus,
  deleteRoom
} from "../../controllers/admin/adminRoomController.js";

const router = express.Router();

router.get("/", protect, adminMiddleware, getAllRooms);
router.put("/toggle/:id", protect, adminMiddleware, toggleRoomStatus);
router.delete("/:id", protect, adminMiddleware, deleteRoom);

export default router;
