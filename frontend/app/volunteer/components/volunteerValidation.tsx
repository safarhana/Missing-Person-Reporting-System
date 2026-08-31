import { z } from "zod";

export const volunteerValidation = z.object({
    username: z 
    .string()
    .min(3, "Username must be at least 3 characters."),

    fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters."),

    email: z
    .string()
    .email("please enter a valid email address."),

    phone: z
    .string()
    .min(11, "Phone number must be at least 11 characters."),

    password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});

export const loginSchema = z.object({
    username: z
    .string()
    .min(3, "Username must be at least 3 characters."),
    
    password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});
