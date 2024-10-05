import { Router } from "express";

import postsController from "./posts";
const router = Router();

router.get("/", (req, res) => res.send("Welcome"));

router.use("/posts", postsController);

export default router;
