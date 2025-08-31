import { z } from 'zod';
import { CreateUserSchema } from './create-user.dto';

// Create a partial Zod schema from the CreateUserSchema to allow for optional fields.
export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
