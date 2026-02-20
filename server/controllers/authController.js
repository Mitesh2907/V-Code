import connectDB from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/userModel.js";

/**
 * REGISTER
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const pool = await connectDB();

    // 🔥 Check if admin already exists
    const [[{ adminCount }]] = await pool.query(
      "SELECT COUNT(*) as adminCount FROM users WHERE role = 'admin'"
    );

    let role = "user";

    // First registered user becomes admin
    if (adminCount === 0) {
      role = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [fullName, email, hashedPassword, role]
    );

    const userId = result[0].insertId;

    const token = jwt.sign(
      { userId, role },   // 🔥 include role in JWT
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: userId,
        fullName,
        email,
        role,
        avatar: null,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * LOGIN
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 🚫 CHECK IF USER IS BLOCKED
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }


    const token = jwt.sign(
      { userId: user.id, role: user.role },  // 🔥 include role
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,  // ⚠ DB column fix
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET CURRENT USER
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("GET /me ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const pool = await connectDB();

    const [users] = await pool.query(
      "SELECT id, password FROM users WHERE id = ?",
      [userId]
    );

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const pool = await connectDB();

    await pool.query(
      "UPDATE users SET fullName = ? WHERE id = ?",
      [name, userId]
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


