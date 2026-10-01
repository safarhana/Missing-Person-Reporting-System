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
    .min(6, "Password must be at least 6 characters.")
    .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter."
      ),
});

export const loginSchema = z.object({
    username: z
    .string()
    .min(3, "Username must be at least 3 characters."),
    
    password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter."
      ),
});

export const forgotPasswordSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters."),
});


export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits.")
    .regex(/^\d{6}$/, "Code must contain only numbers."),
});


export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter."
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });
