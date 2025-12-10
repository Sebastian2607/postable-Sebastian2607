import { Request, Response, NextFunction } from "express";
import { createLike, deleteLike } from "../../services/likes-service.js";

export async function createLikeHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { postId } = req.params;
    const userId = req.userId; 

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

    const likedPost = await createLike(Number(postId), Number(userId));

    if (!likedPost) return res.status(400).json({ ok: false, message: "Post no encontrado o ya tiene like" });

    res.status(201).json({ ok: true, data: likedPost });
  } catch (error) {
    next(error);
  }
}

export async function deleteLikeHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

    const unlikedPost = await deleteLike(Number(postId), Number(userId));

    if (!unlikedPost) return res.status(400).json({ ok: false, message: "Post no encontrado o no se encontro ningún like propio" });

    res.json({ ok: true, data: unlikedPost });
  } catch (error) {
    next(error);
  }
}
