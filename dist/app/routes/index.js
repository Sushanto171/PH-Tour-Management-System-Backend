"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const booking_route_1 = require("../modules/booking/booking.route");
const division_route_1 = require("../modules/division/division.route");
const otp_routes_1 = require("../modules/otp/otp.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const tour_route_1 = require("../modules/tour/tour.route");
const user_route_1 = require("../modules/user/user.route");
const stats_route_1 = require("../modules/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRouter = [
    {
        path: "/user",
        route: user_route_1.userRouters,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/division",
        route: division_route_1.divisionRoutes,
    },
    {
        path: "/tour",
        route: tour_route_1.tourRoutes,
    },
    {
        path: "/booking",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/otp",
        route: otp_routes_1.OTPRoutes,
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes,
    },
];
moduleRouter.forEach((route) => exports.router.use(route.path, route.route));
