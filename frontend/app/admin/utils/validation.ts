import { z } from "zod";
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username cannot exceed 100 characters"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(150, "Full name cannot exceed 150 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(1, "Confirm password is required")
    .min(6, "Confirm password must be at least 6 characters"),
});

export const updateAdminSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(150, "Full name cannot exceed 150 characters"),
  password: z.string().optional(),
  isActive: z.boolean(),
});

export const assignmentSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
});
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

export const getStoredUsername = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("username");
};

export const setAuthSession = (token: string, username: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", username);
  }
};

export const clearAuthSession = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.clear();
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
