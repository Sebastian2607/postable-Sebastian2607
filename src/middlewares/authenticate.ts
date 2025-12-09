import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
 
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
 
const jwtSecret = "secret-key";
 
export function authenticateHandler( req: Request, res: Response, next: NextFunction ) {
  const token = req.headers.authorization?.split(" ")[1];
 
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
 
  try {
    const payload = jwt.verify(token, jwtSecret) as {
      userId: number;
      iat: number;
      exp: number;
    };
 
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "No autorizado" });
  }
}
