import { Router } from "express";

import { getAllPosts, createPost, editPost } from "../controllers";

const router = Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.put("/:id", editPost);

export default router;
