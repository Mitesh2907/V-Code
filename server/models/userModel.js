import connectDB from "../config/db.js";

/**
 * CREATE USER
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
 * FIND USER BY EMAIL
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
 * FIND USER BY ID
 */
export const findUserById = async (id) => {
  const db = await connectDB();

  const [rows] = await db.query(
    `
    SELECT id, fullName, email, avatar, role
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};