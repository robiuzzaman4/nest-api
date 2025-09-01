import { z } from 'zod';

export const ChangePasswordSchema = z
  .object({
    phone: z.string().length(11, 'Phone number must be 11 digits long.'),
    oldPassword: z.string().min(6, 'Old password is required.'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long.'),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from the old password.',
    path: ['newPassword'],
  });

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
