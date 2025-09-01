import { z } from 'zod';
import { CreateUserSchema } from '../dto/create-user.dto';
import { AddressDto } from '../dto/address.dto';

export interface IUser extends z.infer<typeof CreateUserSchema> {
  _id: string;
  user_id: string;
  is_active: boolean;
  is_deleted: boolean;
  password: string;
  present_address: AddressDto;
  permanent_address: AddressDto;
}
