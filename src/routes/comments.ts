import { Router } from "express";

import { createComment } from "../controllers";

const router = Router();

router.post("/", createComment);

export default router;
