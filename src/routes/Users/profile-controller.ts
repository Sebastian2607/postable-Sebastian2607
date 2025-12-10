import { Request, Response, NextFunction } from "express";
import { getUserById, updateUser, deleteUser } from "../../services/user-service.js";

export async function getMe( req: Request, res: Response, next: NextFunction ) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });
  
    const user = await getUserById(userId);

    if (!user) return res.status(404).json({ ok: false, message: "Usuario no autenticado" });

    res.json({ ok: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateMe( req: Request, res: Response, next: NextFunction ) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

    const data = req.body;

    if (!data.username && !data.email && !data.firstName && !data.lastName) 
      return res.status(400).json({ ok: false, message: "Sin datos para actualizar" });
    
    const updatedUser = await updateUser(userId, data);

    if (!updatedUser) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    res.json({ ok: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
}

export async function deleteMe( req: Request, res: Response, next: NextFunction ) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

    const result = await deleteUser(userId);

    if (!result) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}