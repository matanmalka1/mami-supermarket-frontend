import * as z from "zod";

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "First name must contain only letters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "Last name must contain only letters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^05\d-?\d{7}$/, "Invalid Israeli phone format (05X-XXXXXXX)"),
    password: z.string().min(1, "Password is required").pipe(passwordRules),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .pipe(passwordRules),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, { message: "You must accept the terms" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
