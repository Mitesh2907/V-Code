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

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const pool = await connectDB();

    // ✅ Check ownership
    const [rooms] = await pool.query(
      "SELECT * FROM rooms WHERE id = ? AND created_by = ?",
      [roomId, userId]
    );

    if (rooms.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 1️⃣ Get folders of this room
    const [folders] = await pool.query(
      "SELECT id FROM folders WHERE room_id = ?",
      [roomId]
    );

    const folderIds = folders.map(f => f.id);

    if (folderIds.length > 0) {

      // 2️⃣ Get files inside these folders
      const [files] = await pool.query(
        `SELECT id FROM files WHERE folder_id IN (${folderIds.map(() => "?").join(",")})`,
        folderIds
      );

      const fileIds = files.map(f => f.id);

      if (fileIds.length > 0) {
        // 3️⃣ Delete file contents
        await pool.query(
          `DELETE FROM file_contents WHERE file_id IN (${fileIds.map(() => "?").join(",")})`,
          fileIds
        );

        // 4️⃣ Delete files
        await pool.query(
          `DELETE FROM files WHERE id IN (${fileIds.map(() => "?").join(",")})`,
          fileIds
        );
      }

      // 5️⃣ Delete folders
      await pool.query(
        `DELETE FROM folders WHERE id IN (${folderIds.map(() => "?").join(",")})`,
        folderIds
      );
    }

    // 6️⃣ Delete chat messages
    await pool.query("DELETE FROM messages WHERE room_id = ?", [roomId]);

    // 7️⃣ Delete members
    await pool.query("DELETE FROM room_members WHERE room_id = ?", [roomId]);

    // 8️⃣ Finally delete room
    await pool.query("DELETE FROM rooms WHERE id = ?", [roomId]);

    res.json({ message: "Room deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
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

    const [rooms] = await pool.query(
      "SELECT * FROM rooms WHERE id = ? AND created_by = ?",
      [roomId, userId]
    );

    if (rooms.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pool.query(
      "UPDATE rooms SET room_name = ? WHERE id = ?",
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

    // check membership
    const [members] = await pool.query(
      "SELECT * FROM room_members WHERE room_id = ? AND user_id = ?",
      [roomId, userId]
    );

    if (members.length === 0) {
      return res.status(400).json({ message: "Not a member of this room" });
    }

    // prevent creator from exiting (optional)
    const [rooms] = await pool.query(
      "SELECT * FROM rooms WHERE id = ? AND created_by = ?",
      [roomId, userId]
    );

    if (rooms.length > 0) {
      return res.status(400).json({
        message: "Room owner cannot exit. You can delete the room instead.",
      });
    }

    await pool.query(
      "DELETE FROM room_members WHERE room_id = ? AND user_id = ?",
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

    const [room] = await pool.query(
      "SELECT created_by FROM rooms WHERE id = ?",
      [roomId]
    );

    if (!room.length) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room[0].created_by !== userId) {
      return res.status(403).json({ message: "Only owner can view members" });
    }

    const [members] = await pool.query(
      `SELECT u.id, u.fullName, u.email
       FROM room_members rm
       JOIN users u ON rm.user_id = u.id
       WHERE rm.room_id = ?`,
      [roomId]
    );

    res.json({ members });

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

    // check owner
    const [room] = await pool.query(
      "SELECT created_by FROM rooms WHERE id = ?",
      [roomId]
    );

    if (!room.length) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room[0].created_by !== ownerId) {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    await pool.query(
      "DELETE FROM room_members WHERE room_id = ? AND user_id = ?",
      [roomId, userId]
    );

    res.json({ message: "Member removed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
