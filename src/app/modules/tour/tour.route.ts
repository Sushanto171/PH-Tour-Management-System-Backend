import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateZodSchema";
import { Role } from "../user/user.interface";
import { tourController } from "./tour.controller";
import { tourTypeZodSchema } from "./tour.validation";

const router = Router();

// tour types
router.post(
  "/create-tour-type",
  validateRequest(tourTypeZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.createTourType
);

router.get("/tour-types", tourController.getAllTourTypes);

router.patch(
  "/tour-types/:id",
  validateRequest(tourTypeZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.updateTourType
);

router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTourType
);

export const tourRoutes = router;
