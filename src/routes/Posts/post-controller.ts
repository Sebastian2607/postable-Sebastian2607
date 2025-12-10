import { Request, Response, NextFunction } from "express";
import { getAllPosts, getPostsByUsername, createPost, updatePost, deletePost } from "../../services/post-service.js";

export async function getAllPostsHandler( _req: Request, res: Response, next: NextFunction ) {
  try {
    const posts = await getAllPosts();
    
    res.json({ ok: true, data: posts });
  } catch (error) {
    next(error);
  }
} 

export async function getPostsByUsernameHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { username } = req.params;
    const posts = await getPostsByUsername(username);

    if (!posts) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    
    res.json({ ok: true, data: posts });
  } catch (error) {
    next(error);
  }
}

export async function createPostHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });
    
    if (!content) return res.status(400).json({ ok: false, message: "Contenido obligatorio para crear post" });

    const newPost = await createPost(content, userId);

    if (!newPost) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    res.status(201).json({ ok: true, data: newPost });
  } catch (error) {
    next(error);
  }
};

export async function updatePostHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

    if (!content) return res.status(400).json({ ok: false, message: "Contenido obligatorio para actualizar post" });

    const updatedPost = await updatePost(Number(postId), content, userId);

    if (!updatedPost) return res.status(404).json({ ok: false, message: "Post no encontrado o usuario no authorizado" });

    res.json({ ok: true, data: updatedPost });
  } catch (error) {
    next(error);
  }
}

export async function deletePostHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

    const result = await deletePost(Number(postId), userId);

    if (!result) return res.status(404).json({ ok: false, message: "Post no encontrado o usuario no autorizado" });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}