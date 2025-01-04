import { Router } from "express";

import postsController from "./posts";
import commentsController from "./comments";
const router = Router();

router.get("/", (req, res) => res.send("Welcome"));

router.use("/posts", postsController);
router.use("/comments", commentsController);

export default router;
