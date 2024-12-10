import { Router } from "express";

import { getAllPosts, createPost, deletePost, editPost } from "../controllers";
import authenticateToken from "../middlewares/authenticate-token";
import checkPermissions from "../middlewares/check-permissions";

const router = Router();

// Public route to get all posts
router.get("/", getAllPosts);

// Protected route to create a post (only accessible by 'admin' or 'editor')
router.post("/", authenticateToken, createPost);
router.delete("/:id", authenticateToken, deletePost);
router.patch("/:id", authenticateToken, editPost);

export default router;