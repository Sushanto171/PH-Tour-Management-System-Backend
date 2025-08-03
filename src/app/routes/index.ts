import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { divisionRoutes } from "../modules/division/division.route";
import { tourRoutes } from "../modules/tour/tour.route";
import { userRouters } from "../modules/user/user.route";

export const router = Router();

const moduleRouter = [
  {
    path: "/user",
    route: userRouters,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/division",
    route: divisionRoutes,
  },
  {
    path: "/tour",
    route: tourRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
