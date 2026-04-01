import connectDB from "../config/db.js";

/**
 * CREATE USER
 */
export const createUser = async ({ fullName, email, password }) => {
  const db = await connectDB();

  const result = await db.query(
    `
    INSERT INTO users ("fullName", email, password)
    VALUES ($1, $2, $3)
    RETURNING id, "fullName", email
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
    SELECT id, "fullName", email, avatar, role
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];
};