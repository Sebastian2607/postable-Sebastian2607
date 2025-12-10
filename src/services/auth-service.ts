import { pool } from "../lib/db.js";
import { hashPassword, verifyPassword } from "../lib/auth.js";
import { generateToken } from "../lib/auth.js";
import { CreateUserData, LoginData } from "../types/user-types.js";


export async function signup(data: CreateUserData) {
  const { username, email, password, firstName, lastName } = data;

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) return null;

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (username, password, email, firstName, lastName)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [username, hashedPassword, email, firstName, lastName]
  );

  const user = result.rows[0];

  const token = generateToken(user.id, user.role);

  delete user.password

  return { user, token }
}

export async function login(data: LoginData) {
  const { username, email, password } = data;

  const result = await pool.query(
    `SELECT * 
     FROM users 
     WHERE email = $1 AND username = $2`,
    [email, username]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) return null;

  const token = generateToken(user.id, user.role);

  delete user.password;

  return { user, token }
}