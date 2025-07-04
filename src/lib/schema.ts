import { z } from "zod";

export const BoardSchema = z.object({
    title: z.string().min(1, "Board Title is required"),
    description: z.string().min(10, "Description must be atleast 10 characters long"),
    category: z.string().min(1, "Category is required"),
    mode: z.string().min(2, "Mode is required"),
    duration: z.string().optional()
})