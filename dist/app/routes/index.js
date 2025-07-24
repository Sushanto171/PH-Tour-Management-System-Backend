"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRouter = [
    {
        path: "/user",
        route: user_route_1.userRouters,
    },
];
moduleRouter.forEach((route) => exports.router.use(route.path, route.route));
