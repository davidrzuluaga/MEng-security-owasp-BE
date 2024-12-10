import { Router } from "express";

import postsController from "./posts";
import authController from "./auth";
const router = Router();

router.get("/", (req, res) => res.send("Welcome"));

router.use("/posts", postsController);
router.use("/auth", authController);

export default router;
