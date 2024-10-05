import { Router } from "express";

import { getAllPosts, createPost } from "../controllers";

const router = Router();

router.get("/", getAllPosts);
router.post("/", createPost);

export default router;