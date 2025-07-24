import { NextFunction, Request, Response } from "express";
import z, { AnyZodObject } from "zod/v3";
import { IsActive, Role } from "./user.interface";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export const createUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be string format.",
      required_error: "Name must be required.",
    })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),

  email: z
    .string({
      required_error: "Email must be required.",
      invalid_type_error: "Email must be string format.",
    })
    .min(5, { message: "Email must be at least 5 characters long" })
    .email(),
  password: z
    .string({ invalid_type_error: "Password must be string format." })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  phone: z
    .string({ invalid_type_error: "Phone must be string format." })
    .regex(/^(\+?88)?01[3-9]\d{8}$/, {
      message:
        "Phone must be valid for Bangladesh, Format: '+8801########' or 'o1#########' ",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be string format.",
      required_error: "Name must be required.",
    })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),

  password: z
    .string({ invalid_type_error: "Password must be string format." })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    })
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone must be string format." })
    .regex(/^(\+?88)?01[3-9]\d{8}$/, {
      message:
        "Phone must be valid for Bangladesh, Format: '+8801########' or 'o1#########' ",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isDeleted: z
    .boolean({ message: "Is Deleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ message: "IsVerified must be true or false" })
    .optional(),
});
