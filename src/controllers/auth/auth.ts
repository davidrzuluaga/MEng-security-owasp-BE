import { RequestHandler } from "express";

export const signIn: RequestHandler = (req, res, next) => {
  return res.status(200).json({ message: "registrado con éxito" });
};
