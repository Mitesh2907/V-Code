import bcrypt from "bcryptjs";
import {
  createRoomDB,
  getRoomByNumberDB,
  addRoomMemberDB,
  getCreatedRoomsDB,
  getJoinedRoomsDB,
} from "../models/roomModel.js";
import connectDB from "../config/db.js";
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

    // ❌ ROOM CLOSED CHECK
if (room.status === "closed") {
  return res.status(403).json({
    success: false,
    message: "This room has been closed by admin",
  });
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
    const userId = req.userId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    // 1️⃣ Room exist?
    const room = await getRoomByIdDB(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // 🔒 2️⃣ CLOSED ROOM BLOCK (IMPORTANT)
    if (room.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This room has been closed by admin",
      });
    }

    // 3️⃣ Member check
    const isMember = await isUserRoomMemberDB(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this room",
      });
    }

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


import connectDB from "../config/db.js";

/**
 * CREATE USER
 */
export const createUser = async ({ fullName, email, password }) => {
  const db = await connectDB();

  const result = await db.query(
    `
    INSERT INTO users (fullName, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, fullName, email
    `,
    [fullName, email, password]
  );

  return result.rows[0];
};

/**
 * FIND USER BY EMAIL
 */
export const findUserByEmail = async (email) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  return result.rows[0];
};

/**
 * FIND USER BY ID
 */
export const findUserById = async (id) => {
  const db = await connectDB();

  const result = await db.query(
    `
    SELECT id, fullName, email, avatar, role
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];
};


export const renameRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { roomName } = req.body;
    const userId = req.userId;

    if (!roomName) {
      return res.status(400).json({ message: "Room name required" });
    }

    const pool = await connectDB();

    const result = await pool.query(
      "SELECT * FROM rooms WHERE id = $1 AND created_by = $2",
      [roomId, userId]
    );

    const rooms = result.rows;

    if (rooms.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pool.query(
      "UPDATE rooms SET room_name = $1 WHERE id = $2",
      [roomName, roomId]
    );

    res.json({ message: "Room renamed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const exitRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const pool = await connectDB();

    const result = await pool.query(
      "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
      [roomId, userId]
    );

    const members = result.rows;

    if (members.length === 0) {
      return res.status(400).json({ message: "Not a member of this room" });
    }

    const roomResult = await pool.query(
      "SELECT * FROM rooms WHERE id = $1 AND created_by = $2",
      [roomId, userId]
    );

    const rooms = roomResult.rows;

    if (rooms.length > 0) {
      return res.status(400).json({
        message: "Room owner cannot exit. Delete room instead.",
      });
    }

    await pool.query(
      "DELETE FROM room_members WHERE room_id = $1 AND user_id = $2",
      [roomId, userId]
    );

    res.json({ message: "Exited room successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRoomMembers = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const pool = await connectDB();

    const result = await pool.query(
      "SELECT created_by FROM rooms WHERE id = $1",
      [roomId]
    );

    const room = result.rows;

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room[0].created_by !== userId) {
      return res.status(403).json({ message: "Only owner can view members" });
    }

    const membersResult = await pool.query(
      `SELECT u.id, u.full_name, u.email
       FROM room_members rm
       JOIN users u ON rm.user_id = u.id
       WHERE rm.room_id = $1`,
      [roomId]
    );

    res.json({ members: membersResult.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const removeMember = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const ownerId = req.userId;

    const pool = await connectDB();

    const result = await pool.query(
      "SELECT created_by FROM rooms WHERE id = $1",
      [roomId]
    );

    const room = result.rows;

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room[0].created_by !== ownerId) {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    await pool.query(
      "DELETE FROM room_members WHERE room_id = $1 AND user_id = $2",
      [roomId, userId]
    );

    res.json({ message: "Member removed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
