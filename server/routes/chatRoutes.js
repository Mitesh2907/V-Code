import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getRoomMessages,
  getUnreadCount,
  markMessagesSeen
} from "../controllers/chatController.js";


const router = express.Router();

router.get("/unread/:roomId", protect, getUnreadCount);

router.get("/:roomId", protect, getRoomMessages);

router.patch("/seen/:roomId", protect, markMessagesSeen);


export default router;
