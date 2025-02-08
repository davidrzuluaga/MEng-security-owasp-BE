import { Router } from "express";
import PostController from "../controllers/post/post-controller";

const router = Router();

router.get("/", PostController.getAllPosts);
router.post("/", PostController.createPost);
router.put("/:id", PostController.editPost);

export default router;
