import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
 
const jwtSecret = "secret-key";

export const generateToken = (userId: number) => jwt.sign({ userId }, jwtSecret, { expiresIn: "1h", });

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const verifyPassword = (password: string, hashedPassword: string) => bcrypt.compare(password, hashedPassword);