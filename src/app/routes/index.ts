import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { divisionRoutes } from "../modules/division/division.route";
import { OTPRoutes } from "../modules/otp/otp.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { tourRoutes } from "../modules/tour/tour.route";
import { userRouters } from "../modules/user/user.route";
import { StatsRoutes } from "../modules/stats/stats.route";

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
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: OTPRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
