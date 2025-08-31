import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// === address schema ===
@Schema({ _id: false })
class Address {
  @Prop()
  house_number: string;

  @Prop({ required: true })
  village: string;

  @Prop({ required: true })
  upazila: string;

  @Prop({ required: true })
  zila: string;
}

// === user schema ===
@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  user_id: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  father_name: string;

  @Prop({ required: true })
  mother_name: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true, unique: true, match: /^\d{11}$/ })
  phone: string;

  @Prop({ type: Address, required: true })
  present_address: Address;

  @Prop({ type: Address, required: true })
  permanent_address: Address;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ required: true, enum: ['user', 'admin', 'super_admin'] })
  role: 'user' | 'admin' | 'super_admin';
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
