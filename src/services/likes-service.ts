import { pool } from "../lib/db.js";
import { getPostById } from "./post-service.js";
import { getUserById } from "./user-service.js";
import { Post } from "../types/post-types.js";

export async function getLikeByUserAndPostId(postId: number, userId: number) {
  const result = await pool.query(
    `SELECT *
     FROM likes
     WHERE postId = $1 AND userId = $2`,
    [postId, userId]
  );

  if (result.rows.length === 0) return null;

  return result.rows[0];
}

export async function createLike(postId: number, userId: number) {
  const post = await getPostById(postId);
  const user = await getUserById(userId);

  if (!post || !user) return null;

  const existinglike = await getLikeByUserAndPostId(postId, userId);

  if (existinglike) return null;

  const likeResult = await pool.query(
    `INSERT INTO likes (postId, userId)
     VALUES ($1, $2)
     RETURNING *`,
    [postId, userId]
  );

  const postResult = await pool.query(
    `UPDATE posts
     SET likesCount = likesCount + 1
     WHERE id = $1
     RETURNING *`,
    [postId]
  );

  if (likeResult.rows.length === 0 || postResult.rows.length === 0) return null;

  return postResult.rows[0] as Post;
}

export async function deleteLike(postId: number, userId: number) {
  const post = await getPostById(postId);
  const user = await getUserById(userId);
  const like = await getLikeByUserAndPostId(postId, userId);

  if (!post || !user || !like) return null;

  await pool.query(
    `DELETE FROM likes 
     WHERE postId = $1 AND userId = $2`,
    [postId, userId]
  );

  const postResult = await pool.query(
    `UPDATE posts
     SET likesCount = likesCount - 1
     WHERE id = $1
     RETURNING *`,
    [postId]
  );
  
  return postResult.rows[0] as Post
}