import { Router } from "express";

import { signIn } from "../controllers";

const router = Router();

router.get("/", signIn);

export default router;
