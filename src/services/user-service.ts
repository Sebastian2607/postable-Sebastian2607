import { pool } from "../lib/db.js";
import { UpdatedUser } from "../types/user-types.js";

export async function getAllUsers() {
  const result = await pool.query(`
    SELECT id, username, email, firstName, lastName, role, createdAt, updatedAt
    FROM users
    ORDER BY createdAt DESC
  `); 

  return result.rows
}

export async function getUserByUsername(username: string) {
  const result = await pool.query(
    `SELECT *
     FROM users 
     WHERE username = $1`,
    [username]
  );

  if (result.rows.length === 0) return null

  delete result.rows[0].password

  return result.rows[0];
};

export async function getUserById(userId: number) {
  const result = await pool.query(
    `SELECT *
     FROM users 
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) return null

  delete result.rows[0].password

  return result.rows[0];
};

export async function updateUser(userId: number, updates: UpdatedUser) {
  const { username, email, firstName, lastName } = updates;

  const user = await getUserById(userId)

  if (!user) return null

  const result = await pool.query(
    `UPDATE users
     SET username = $2, 
         email = $3, 
         firstName = $4, 
         lastName = $5, 
         updatedAt = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      userId, 
      username ?? user.username, 
      email ?? user.email, 
      firstName ?? user.firstname, 
      lastName ?? user.lastname, 
    ]
  );

  if (result.rows.length === 0) return null

  delete result.rows[0].password;
    
  return result.rows[0];
}

export async function deleteUser(userId: number) {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1`,
    [userId]
  );

  return (result.rowCount ?? 0) > 0
}