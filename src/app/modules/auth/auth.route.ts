import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateZodSchema";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import { updatePasswordZodSchema } from "./auth.validation";

const router = Router();
router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.get("/logout", AuthControllers.logout);
router.post(
  "/set-password",
  validateRequest(updatePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
router.post(
  "/change-password",
  validateRequest(updatePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post(
  "/reset-password",
  validateRequest(updatePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
      prompt: "consent",
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?message=There are some issues with your account. Please contact our support team.`,
  }),
  AuthControllers.googleCallbackController
);

export const authRoutes = router;
