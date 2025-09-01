import { z } from 'zod';

export const LoginSchema = z.object({
  phone: z.string().length(11, 'Phone number must be 11 digits long.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
