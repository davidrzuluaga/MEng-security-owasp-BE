import { Router } from "express";

import { getAllPosts, createPost } from "../controllers";
import authenticateToken from "../middlewares/authenticate-token";
import checkPermissions from "../middlewares/check-permissions";

const router = Router();

// Public route to get all posts
router.get("/", getAllPosts);

// Protected route to create a post (only accessible by 'admin' or 'editor')
router.post("/", authenticateToken, checkPermissions(['admin', 'editor']), createPost);

export default router;