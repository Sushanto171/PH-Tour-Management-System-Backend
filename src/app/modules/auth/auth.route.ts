import { Router } from "express";
import { credentialControllers } from "./auth.controller";

const router = Router();
router.post("/login", credentialControllers.credentialLogin);

export const authRoutes = router;
