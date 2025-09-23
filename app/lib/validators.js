import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  key: z
    .string()
    .min(2, "Project key must be at least 2 characters")
    .max(10, "Project key must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Project key must contain only uppercase letters and numbers"
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

// export const issueSchema = z.object({
//   title: z.string().min(1, "Issue title is required"),
//   description: z.string().optional(),
//   status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
//   priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
//   assigneeId: z.string().optional(),
//   projectId: z.string().min(1, "Project ID is required"),
// });
