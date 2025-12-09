import { Request, Response, NextFunction } from "express";
import { login, signup } from "../../services/auth-service.js";

export async function loginHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Faltan datos obligatorios" });

    const result = await login({ username, email, password });

    if (!result) return res.status(401).json({ error: "Credenciales inválidas" });

    const { token } = result;

    res.status(200).json({ ok: true, data: { token } });
  } catch (error) {
    next(error);
  }
}


export async function signupHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const {
      username,
      email,
      password,
      firstName = "Nombre",
      lastName = "Apellido",
      role = "user"
    } = req.body;

    if (!username || !email || !password) return res.status(400).json({ error: "Faltan datos obligatorios" });

    if (!email.includes("@")) return res.status(400).json({ error: "El email no es válido" });

    const result = await signup({ username, password, email, firstName, lastName, role });

    if (!result) return res.status(400).json({ error: "El usuario ya existe" });

    res.status(201).json({ ok: true, data: result });
  } catch (error) {
    next(error);
  }
}
