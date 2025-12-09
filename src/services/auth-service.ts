import { pool } from "../lib/db.js";
import { hashPassword, verifyPassword } from "../lib/auth.js";
import { generateToken } from "../lib/auth.js";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatedUser {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: "user" | "admin";
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "user" | "admin";
}

export interface LoginData {
  username?: string;
  email: string;
  password: string;
}

export async function signup(data: CreateUserData) {
  const { username, email, password, firstName, lastName, role } = data;

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) return null;

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (username, password, email, firstName, lastName, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, username, email, firstName, lastName, role, createdAt, updatedAt`,
    [username, hashedPassword, email, firstName, lastName, role]
  );


  const user = result.rows[0];

  const token = generateToken(user.id);

  return { user, token }
}

export async function login(data: LoginData) {
  const { username, email, password } = data;

  const result = await pool.query(
    `SELECT id, username, password, email, firstName, lastName, role, createdAt, updatedAt 
     FROM users 
     WHERE email = $1 AND username = $2`,
    [email, username]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) return null;

  const token = generateToken(user.id);

  delete user.password;

  return { user, token }
}

export async function getUserById(userId: number) {
  const result = await pool.query(
    `SELECT id, username, email, firstName, lastName, role, createdAt, updatedAt 
     FROM users 
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0] || null;
};

export async function updateUser(userId: number, updates: UpdatedUser) {
  const { username, email, firstName, lastName, role } = updates;

  const user = await getUserById(userId)
  
  const result = await pool.query(
    `UPDATE users
     SET username = $2, 
         email = $3, 
         firstName = $4, 
         lastName = $5, 
         role = $6,
         updatedAt = NOW()
     WHERE id = $1
     RETURNING id, username, email, firstName, lastName, role, createdAt, updatedAt`,
    [userId, username || user.username, email || user.email, firstName || user.firstname, lastName || user.lastname, role || user.role]
  );
    
  return result.rows[0] || null;
}

export async function deleteUser(userId: number) {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1`,
    [userId]
  );

  return (result.rowCount?? 0) > 0
}