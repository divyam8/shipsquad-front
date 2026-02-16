import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  projectDescription: z
    .string()
    .max(500, "Project description must be under 500 characters")
    .optional()
    .default(""),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
