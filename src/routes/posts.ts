import { Router } from "express";

import { getAllPosts, createPost } from "../controllers";

const router = Router();

// Public route to get all posts
router.get("/", getAllPosts);

// Protected route to create a post (only accessible by 'admin' or 'editor')
router.post("/", createPost);

export default router;
