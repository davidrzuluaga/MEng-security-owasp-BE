import { Router } from "express";

import authController from "./auth";
import { saveReqLogs } from "../middlewares";
const router = Router();

router.get("/", saveReqLogs, (req, res) => res.send("Welcome"));

router.use("/auth", authController);

export default router;
