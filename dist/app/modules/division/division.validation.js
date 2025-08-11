"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
exports.createDivisionZodSchema = v3_1.default.object({
    name: v3_1.default
        .string({ invalid_type_error: "Division name must be string format." })
        .min(1, {
        message: "Division name too short. Please provide at least 2 character longer.",
    }),
    slug: v3_1.default
        .string({
        invalid_type_error: "Slug must be string format",
    })
        .optional(),
    description: v3_1.default
        .string({ invalid_type_error: "Description must be string format" })
        .optional(),
    thumbnail: v3_1.default
        .string({ invalid_type_error: "Thumbnail must be string format" })
        .optional(),
});
exports.updateDivisionZodSchema = v3_1.default.object({
    name: v3_1.default
        .string({ invalid_type_error: "Division name must be string format." })
        .min(2, {
        message: "Division name too short. Please provide at least 2 character longer.",
    })
        .optional(),
    slug: v3_1.default
        .string({
        invalid_type_error: "Slug must be string format",
        required_error: "Slug must be required.",
    })
        .optional(),
    description: v3_1.default
        .string({ invalid_type_error: "Description must be string format" })
        .optional(),
    thumbnail: v3_1.default
        .string({ invalid_type_error: "Thumbnail must be string format" })
        .optional(),
});
