import * as z from "zod";

export const authRegisterResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    full_name: z.string(),
    role: z.string(),
  }),
  access_token: z.string(),
  refresh_token: z.string().nullable(),
  expires_at: z.string(),
});

export const authLoginResponseSchema = authRegisterResponseSchema;

export const authRegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  full_name: z.string(),
  phone: z.string(),
  role: z.string().optional(),
});

export const authLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthRegisterResponse = z.infer<typeof authRegisterResponseSchema>;
export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;
export type AuthRegisterRequest = z.infer<typeof authRegisterRequestSchema>;
export type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>;
