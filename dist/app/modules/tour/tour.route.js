"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateZodSchema_1 = require("../../middlewares/validateZodSchema");
const user_interface_1 = require("../user/user.interface");
const tour_controller_1 = require("./tour.controller");
const tour_validation_1 = require("./tour.validation");
const router = (0, express_1.Router)();
// tour types
router.post("/create-tour-type", (0, validateZodSchema_1.validateRequest)(tour_validation_1.tourTypeZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourController.createTourType);
router.get("/tour-types", tour_controller_1.tourController.getAllTourTypes);
router.patch("/tour-types/:id", (0, validateZodSchema_1.validateRequest)(tour_validation_1.tourTypeZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourController.updateTourType);
router.delete("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourController.deleteTourType);
// tour
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateZodSchema_1.validateRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.tourController.createTour);
router.get("/", tour_controller_1.tourController.retrieveAllTour);
router.get("/:slug", tour_controller_1.tourController.getSingleTOur);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateZodSchema_1.validateRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.tourController.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourController.deleteTour);
exports.tourRoutes = router;
