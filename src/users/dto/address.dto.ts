import { z } from 'zod';

// Define the Zod schema for the nested Address object.
export const AddressSchema = z.object({
  house_number: z.string().optional(),
  village: z.string(),
  upazila: z.string(),
  zila: z.string(),
});

export type AddressDto = z.infer<typeof AddressSchema>;
