import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
 
const jwtSecret = "secret-key";
const expiresIn = "1h"

export const generateToken = (userId: number, userRole: "user" | "admin") => 
  jwt.sign({ userId, userRole }, jwtSecret, { expiresIn });

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const verifyPassword = (password: string, hashedPassword: string) => bcrypt.compare(password, hashedPassword);