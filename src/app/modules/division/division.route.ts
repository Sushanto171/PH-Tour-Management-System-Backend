import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateZodSchema";
import { Role } from "../user/user.interface";
import { divisionController } from "./division.controller";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  divisionController.createDivision
);

router.get("/", divisionController.retrieveAllDivision);
router.get("/:slug", divisionController.getSingleDivision);

router.patch(
  "/:id",
  validateRequest(updateDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.updateDivision
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);

export const divisionRoutes = router;
