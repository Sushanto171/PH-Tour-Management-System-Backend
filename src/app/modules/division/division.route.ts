import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateZodSchema";
import { Role } from "../user/user.interface";
import { divisionController } from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";

const router = Router();

router.post(
  "/create",
  validateRequest(createDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.createDivision
);

export const divisionRoutes = router;
