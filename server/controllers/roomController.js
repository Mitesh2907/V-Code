import bcrypt from "bcryptjs";
import {
  createRoomDB,
  getRoomByNumberDB,
  addRoomMemberDB,
  getCreatedRoomsDB,
  getJoinedRoomsDB,
} from "../models/roomModel.js";

import {
  getRoomByIdDB,
} from "../models/roomModel.js";
import { isUserRoomMemberDB } from "../models/roomModel.js";


/**
 * CREATE ROOM
 */
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomName, password } = req.body;
    const userId = req.userId; // ✅ FIXED

    if (!roomNumber || !roomName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingRoom = await getRoomByNumberDB(roomNumber);
    if (existingRoom) {
      return res.status(409).json({ message: "Room number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const roomId = await createRoomDB({
      roomNumber,
      roomName,
      hashedPassword,
      createdBy: userId,
    });

    await addRoomMemberDB(roomId, userId);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: {
        id: roomId,
        roomNumber,
        roomName,
      },
    });
  } catch (error) {
    console.error("Create Room Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * JOIN ROOM
 */
export const joinRoom = async (req, res) => {
  try {
    const { roomNumber, password } = req.body;
    const userId = req.userId; // ✅ FIXED

    const room = await getRoomByNumberDB(roomNumber);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isMatch = await bcrypt.compare(password, room.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid room password" });
    }

    await addRoomMemberDB(room.id, userId);

    res.json({
      success: true,
      message: "Joined room successfully",
      room: {
        id: room.id,
        roomNumber: room.room_number,
        roomName: room.room_name,
      },
    });
  } catch (error) {
    console.error("Join Room Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET CREATED ROOMS
 */
export const getCreatedRooms = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIXED
    const rooms = await getCreatedRoomsDB(userId);
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET JOINED ROOMS
 */
export const getJoinedRooms = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIXED
    const rooms = await getJoinedRoomsDB(userId);
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ENTER ROOM
 * GET /api/rooms/:roomId/enter
 */
export const enterRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId; // authMiddleware se aata hai

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    // 1️⃣ Room exist karta hai?
    const room = await getRoomByIdDB(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // 2️⃣ User room ka member hai?
    const isMember = await isUserRoomMemberDB(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this room",
      });
    }

    // 3️⃣ Allow entry
    return res.status(200).json({
      success: true,
      message: "Entered room successfully",
      room: {
        id: room.id,
        roomNumber: room.room_number,
        roomName: room.room_name,
        createdAt: room.created_at,
      },
    });
  } catch (error) {
    console.error("Enter Room Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while entering room",
    });
  }
};