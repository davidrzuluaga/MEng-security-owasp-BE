import { Router } from "express";

import authenticateToken from "../middlewares/authenticate-token";
import checkPermissions from "../middlewares/check-permissions";
import { getAllUsers } from "../controllers/auth/get-all";
import { getOneUser } from "../controllers/auth/get-one";
import { createUser } from "../controllers/auth/create";
import { signIn } from "../controllers/auth/sign-in";

const router = Router();

router.get("/", authenticateToken, checkPermissions(["admin"]), getAllUsers);

router.get(
  "/:email",
  authenticateToken,
  checkPermissions(["admin"]),
  getOneUser
);

router.post("/signup", createUser);

router.post("/signin", signIn);

export default router;
