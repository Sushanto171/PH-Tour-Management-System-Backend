import { Router } from "express";
import { userRouters } from "../modules/user/user.route";

export const router = Router();

const moduleRouter = [
  {
    path: "/user",
    route: userRouters,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
