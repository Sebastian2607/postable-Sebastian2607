import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

const jwtSecret = "secret-key";

export function adminOnly( req: Request, res: Response, next: NextFunction ) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ ok: false, message: "Usuario no autenticado" });

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      userId: number;
      userRole: string;
      iat: number;
      exp: number;
    };

    if (payload.userRole !== "admin") 
      return res.status(403).json({ ok: false, message: "Acceso permitido solo para administradores" });

    req.userId = payload.userId;
    req.userRole = payload.userRole;

    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Usuario no autenticado" });
  }
}
