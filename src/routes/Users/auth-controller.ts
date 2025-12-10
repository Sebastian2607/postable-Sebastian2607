import { Request, Response, NextFunction } from "express";
import { login, signup } from "../../services/auth-service.js";

export async function loginHandler( req: Request, res: Response, next: NextFunction ) {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) return res.status(400).json({ ok: false, message: "Faltan datos obligatorios" });

    const result = await login({ username, email, password });

    if (!result) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

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
    } = req.body;

    if (!username || !email || !password) return res.status(400).json({ ok: false, message: "Faltan datos obligatorios" });

    if (!email.includes("@")) return res.status(400).json({ ok: false, message: "Email invalido" });

    const result = await signup({ username, password, email, firstName, lastName });

    if (!result) return res.status(400).json({ ok: false, message: "Usuario ya existe" });

    res.status(201).json({ ok: true, data: result });
  } catch (error) {
    next(error);
  }
}
