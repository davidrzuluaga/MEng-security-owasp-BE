import { Router } from "express";

import { createComment, deleteComment, editComment } from "../controllers";

const router = Router();

// Protected route to create a post (only accessible by 'admin' or 'editor')
router.post("/", createComment);
router.delete("/:id", deleteComment);
router.patch("/:id", editComment);

export default router;
