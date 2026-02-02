import express from "express";
import {
  createRoom,
  joinRoom,
  getCreatedRooms,
  getJoinedRooms,
  enterRoom, 
} from "../controllers/roomController.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/rooms/create
 * @desc    Create a new room
 * @access  Private
 */
router.post("/create", protect, createRoom);

/**
 * @route   POST /api/rooms/join
 * @desc    Join an existing room
 * @access  Private
 */
router.post("/join", protect, joinRoom);

/**
 * @route   GET /api/rooms/created
 * @desc    Get rooms created by logged-in user
 * @access  Private
 */
router.get("/created", protect, getCreatedRooms);

/**
 * @route   GET /api/rooms/joined
 * @desc    Get rooms joined by logged-in user
 * @access  Private
 */
router.get("/joined", protect, getJoinedRooms);

// 🔥 ENTER ROOM ROUTE
router.get("/:roomId/enter", protect, enterRoom);

export default router;
