import * as z from 'zod';

export const profileSettingsSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^05\d-?\d{7}$/, 'Invalid Israeli phone format (05X-XXXXXXX)').optional(),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
