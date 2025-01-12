import { Router } from "express";

import { createComment } from "../controllers";

const router = Router();

// Protected route to create a post (only accessible by 'admin' or 'editor')
router.post("/", createComment);

export default router;
