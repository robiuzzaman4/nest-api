import { z } from 'zod';
import { AddressSchema } from './address.dto';

// Define the Zod schema for creating a new user.
export const CreateUserSchema = z.object({
  full_name: z.string().min(1, 'Name is required!'),
  father_name: z.string(),
  mother_name: z.string(),
  dob: z.string().pipe(z.coerce.date()), // Coerce a string to a Date object
  phone: z.string().length(11, 'Phone number must be 11 digits long.'),
  present_address: AddressSchema,
  permanent_address: AddressSchema,
  is_active: z.boolean().default(true).optional(),
  is_deleted: z.boolean().default(false).optional(),
  role: z.enum(['user', 'admin', 'super_admin']).default('user'),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
