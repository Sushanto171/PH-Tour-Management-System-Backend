import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.createUser);
router.get("/me/:email", userController.getUserByEmail);
router.get("/all-users", userController.getAllUsers);
router.patch("/:email", userController.updateUser);

export const userRouters = router;
