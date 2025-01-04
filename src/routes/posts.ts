import { Router } from "express";

import { getAllPosts, createPost, deletePost, editPost } from "../controllers";

const router = Router();

// Public route to get all posts
router.get("/", getAllPosts);

// Protected route to create a post (only accessible by 'admin' or 'editor')
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", editPost);

export default router;
