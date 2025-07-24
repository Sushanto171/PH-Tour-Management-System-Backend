import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
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
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
