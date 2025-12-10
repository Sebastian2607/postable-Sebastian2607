import { Request, Response, NextFunction } from "express";
import { getAllUsers, getUserByUsername, getUserById } from "../../services/user-service.js";

export async function getAllUsersHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const users = await getAllUsers();

    res.json({ ok: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserByUsernameHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    
    res.json({ ok: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function getUserByIdHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { id } = req.params;
    const user = await getUserById(Number(id));

    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    
    res.json({ ok: true, data: user });
  } catch (error) {
    next(error);
  }
}