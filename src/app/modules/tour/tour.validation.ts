import z from "zod/v3";

export const tourTypeZodSchema = z.object({
  name: z.string({
    invalid_type_error: "Tour Type must be string format",
    required_error: "Tour type must be required",
  }),
});
