import { Request, Response, NextFunction } from "express";
import { getUserById, updateUser, deleteUser } from "../../services/auth-service.js";

export async function getMe( req: Request, res: Response, next: NextFunction ) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: "No autorizado" });
  
    const user = await getUserById(userId);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ ok: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateMe( req: Request, res: Response, next: NextFunction ) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: "No autorizado" });

    const data = req.body;

    if (!data.username && !data.email && !data.firstName && !data.lastName && !data.role) return res.status(400).json({ error: "No hay datos para actualizar" });
    
    const updatedUser = await updateUser(userId, data);

    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ ok: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
}

export async function deleteMe( req: Request, res: Response, next: NextFunction ) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: "No autorizado" });

    const result = await deleteUser(userId);

    if (!result) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}