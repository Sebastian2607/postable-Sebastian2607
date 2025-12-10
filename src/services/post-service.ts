import { pool } from "../lib/db.js";
import { getUserById } from "./user-service.js";
import { Post } from "../types/post-types.js";

export async function getAllPosts() {
  const result = await pool.query(
    `SELECT *
     FROM posts 
     ORDER BY createdAt DESC`
  );

  return result.rows as Post[];
}

export async function getPostsByUsername(username: string) {
  const userResult = await pool.query(
    `SELECT id 
     FROM users 
     WHERE username = $1`,
    [username]
  )

  if (userResult.rows.length === 0) return null;

  const userId = userResult.rows[0].id;

  const postResult = await pool.query(
    `SELECT *
     FROM posts 
     WHERE userId = $1
     ORDER BY createdAt DESC`,
    [userId]
  )

  return postResult.rows as Post[];
}

export async function getPostById(postId: number) {
  const result = await pool.query(
    `SELECT *
     FROM posts
     WHERE id = $1`,
    [postId]
  )

  return result.rows[0] as Post
}

export async function createPost(content: string, userId: number) {
  if (!content) return null;

  const user = await getUserById(userId);

  if (!user) return null;

  const postResult = await pool.query(
    `INSERT INTO posts (userId, content, username)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, content, user.username]
  );

  return postResult.rows[0] as Post;
}

export async function updatePost(postId: number, content: string, userId: number) {
  const result = await pool.query(
    `UPDATE posts 
     SET content = $1, 
         updatedAt = NOW() 
     WHERE id = $2 AND userId = $3
     RETURNING *`, 
    [content, postId, userId]
  );

  return result.rows[0] as Post;
}

export async function deletePost(postId: number, userId: number) {
  const result = await pool.query(
    `DELETE FROM posts 
     WHERE id = $1 AND userId = $2`,
    [postId, userId]
  );

  return (result.rowCount ?? 0) > 0
}