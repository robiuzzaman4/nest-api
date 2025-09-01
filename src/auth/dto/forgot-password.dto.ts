import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  phone: z.string().length(11, 'Phone number must be 11 digits long.'),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
