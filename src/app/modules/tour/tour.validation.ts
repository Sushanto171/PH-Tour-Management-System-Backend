import z from "zod/v3";

export const tourTypeZodSchema = z.object({
  name: z.string({
    invalid_type_error: "Tour Type must be string format",
    required_error: "Tour type must be required",
  }),
});

export const createTourZodSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string.",
    required_error: "Title must be required.",
  }),
  slug: z
    .string({
      invalid_type_error: "Slug must be a string.",
      required_error: "Slug must be required.",
    })
    .optional(),
  division: z.string({
    invalid_type_error: "Division must be a string.",
    required_error: "Division must be required.",
  }),
  tourType: z.string({
    invalid_type_error: "Tour type must be a string.",
    required_error: "Tour type must be required.",
  }),
  description: z
    .string({
      invalid_type_error: "Description must be a string.",
    })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "Cost must be a number." })
    .optional(),
  images: z
    .array(z.string())
    .nonempty({ message: "At least one image is required." })
    .optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date",
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "End date must be a valid date",
    })
    .optional(),
  amenities: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  location: z
    .string({ invalid_type_error: "Location must be a string." })
    .optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z
    .number({ invalid_type_error: "Maximum guest must be a number." })
    .optional(),
  minAge: z
    .number({ invalid_type_error: "Minimum age must be a number." })
    .optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});

export const updateTourZodSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title must be a string.",
      required_error: "Title must be required.",
    })
    .optional(),
  slug: z
    .string({
      invalid_type_error: "Slug must be a string.",
      required_error: "Slug must be required.",
    })
    .optional(),
  division: z
    .string({
      invalid_type_error: "Division must be a string.",
      required_error: "Division must be required.",
    })
    .optional(),
  tourType: z
    .string({
      invalid_type_error: "Tour type must be a string.",
      required_error: "Tour type must be required.",
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string.",
    })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "Cost must be a number." })
    .optional(),
  images: z
    .array(z.string())
    .nonempty({ message: "At least one image is required." })
    .optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date",
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "End date must be a valid date",
    })
    .optional(),
  amenities: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  location: z
    .string({ invalid_type_error: "Location must be a string." })
    .optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z
    .number({ invalid_type_error: "Maximum guest must be a number." })
    .optional(),
  minAge: z
    .number({ invalid_type_error: "Minimum age must be a number." })
    .optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  deleteImages: z.array(z.string()).optional(),
});
