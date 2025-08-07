import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateZodSchema";
import { Role } from "../user/user.interface";
import { tourController } from "./tour.controller";
import {
  createTourZodSchema,
  tourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.validation";

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

// tour
router.post(
  "/create",
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.createTour
);

router.get("/", tourController.retrieveAllTour);
router.get("/:slug", tourController.getSingleTOur);

router.patch(
  "/:id",
  validateRequest(updateTourZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTour
);

export const tourRoutes = router;
