"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourZodSchema = exports.createTourZodSchema = exports.tourTypeZodSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
exports.tourTypeZodSchema = v3_1.default.object({
    name: v3_1.default.string({
        invalid_type_error: "Tour Type must be string format",
        required_error: "Tour type must be required",
    }),
});
exports.createTourZodSchema = v3_1.default.object({
    title: v3_1.default.string({
        invalid_type_error: "Title must be a string.",
        required_error: "Title must be required.",
    }),
    slug: v3_1.default
        .string({
        invalid_type_error: "Slug must be a string.",
        required_error: "Slug must be required.",
    })
        .optional(),
    division: v3_1.default.string({
        invalid_type_error: "Division must be a string.",
        required_error: "Division must be required.",
    }),
    tourType: v3_1.default.string({
        invalid_type_error: "Tour type must be a string.",
        required_error: "Tour type must be required.",
    }),
    description: v3_1.default
        .string({
        invalid_type_error: "Description must be a string.",
    })
        .optional(),
    costFrom: v3_1.default
        .number({ invalid_type_error: "Cost must be a number." })
        .optional(),
    images: v3_1.default
        .array(v3_1.default.string())
        .nonempty({ message: "At least one image is required." })
        .optional(),
    startDate: v3_1.default
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Start date must be a valid date",
    })
        .optional(),
    endDate: v3_1.default
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "End date must be a valid date",
    })
        .optional(),
    amenities: v3_1.default.array(v3_1.default.string()).optional(),
    included: v3_1.default.array(v3_1.default.string()).optional(),
    excluded: v3_1.default.array(v3_1.default.string()).optional(),
    location: v3_1.default
        .string({ invalid_type_error: "Location must be a string." })
        .optional(),
    tourPlan: v3_1.default.array(v3_1.default.string()).optional(),
    maxGuest: v3_1.default
        .number({ invalid_type_error: "Maximum guest must be a number." })
        .optional(),
    minAge: v3_1.default
        .number({ invalid_type_error: "Minimum age must be a number." })
        .optional(),
    departureLocation: v3_1.default.string().optional(),
    arrivalLocation: v3_1.default.string().optional(),
});
exports.updateTourZodSchema = v3_1.default.object({
    title: v3_1.default
        .string({
        invalid_type_error: "Title must be a string.",
        required_error: "Title must be required.",
    })
        .optional(),
    slug: v3_1.default
        .string({
        invalid_type_error: "Slug must be a string.",
        required_error: "Slug must be required.",
    })
        .optional(),
    division: v3_1.default
        .string({
        invalid_type_error: "Division must be a string.",
        required_error: "Division must be required.",
    })
        .optional(),
    tourType: v3_1.default
        .string({
        invalid_type_error: "Tour type must be a string.",
        required_error: "Tour type must be required.",
    })
        .optional(),
    description: v3_1.default
        .string({
        invalid_type_error: "Description must be a string.",
    })
        .optional(),
    costFrom: v3_1.default
        .number({ invalid_type_error: "Cost must be a number." })
        .optional(),
    images: v3_1.default
        .array(v3_1.default.string())
        .nonempty({ message: "At least one image is required." })
        .optional(),
    startDate: v3_1.default
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Start date must be a valid date",
    })
        .optional(),
    endDate: v3_1.default
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "End date must be a valid date",
    })
        .optional(),
    amenities: v3_1.default.array(v3_1.default.string()).optional(),
    included: v3_1.default.array(v3_1.default.string()).optional(),
    excluded: v3_1.default.array(v3_1.default.string()).optional(),
    location: v3_1.default
        .string({ invalid_type_error: "Location must be a string." })
        .optional(),
    tourPlan: v3_1.default.array(v3_1.default.string()).optional(),
    maxGuest: v3_1.default
        .number({ invalid_type_error: "Maximum guest must be a number." })
        .optional(),
    minAge: v3_1.default
        .number({ invalid_type_error: "Minimum age must be a number." })
        .optional(),
    departureLocation: v3_1.default.string().optional(),
    arrivalLocation: v3_1.default.string().optional(),
    deleteImages: v3_1.default.array(v3_1.default.string()).optional(),
});
