import z from "zod/v3";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division name must be string format." })
    .min(2, {
      message:
        "Division name too short. Please provide at least 2 character longer.",
    }),
  slug: z.string({
    invalid_type_error: "Slug must be string format",
    required_error: "Slug must be required.",
  }),
  description: z
    .string({ invalid_type_error: "Description must be string format" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be string format" })
    .optional(),
});
