import connectDB from "../config/db.js";
import pool from "../config/db.js";


/**
 * CREATE USER (Register)
 * Fields saved in DB:
 * fullName, email, password
 */
export const createUser = async ({ fullName, email, password }) => {
  const db = await connectDB();

  const [result] = await db.query(
    `
    INSERT INTO users (fullName, email, password)
    VALUES (?, ?, ?)
    `,
    [fullName, email, password]
  );

  return result;
};

/**
 * FIND USER BY EMAIL (Login)
 */
export const findUserByEmail = async (email) => {
  const db = await connectDB();

  const [rows] = await db.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  return rows[0];
};

/**
 * FIND USER BY ID (JWT Protected Routes)
 */
export const findUserById = async (id) => {
  const pool = await connectDB();   // 👈 VERY IMPORTANT
  const [rows] = await pool.query(
    "SELECT id, fullName, email FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

