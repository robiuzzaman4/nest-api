import { z } from 'zod';
import { CreateUserSchema } from './create-user.dto';

// === update user dto ===
export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
