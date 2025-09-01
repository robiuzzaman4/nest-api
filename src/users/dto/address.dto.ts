import { z } from 'zod';

// === address dto ===
export const AddressSchema = z.object({
  house_number: z.string().optional(),
  village: z.string().min(1, 'Village is required.'),
  upazila: z.string().min(1, 'Upazila is required.'),
  zila: z.string().min(1, 'Zila is required.'),
});

export type AddressDto = z.infer<typeof AddressSchema>;
