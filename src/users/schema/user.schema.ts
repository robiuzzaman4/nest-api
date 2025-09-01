import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Model } from 'mongoose';

// === user address schema ===
@Schema()
export class Address {
  @Prop({ required: true })
  house_number: string;

  @Prop({ required: true })
  village: string;

  @Prop({ required: true })
  upazila: string;

  @Prop({ required: true })
  zila: string;
}

// === user schema ===
@Schema()
export class User {
  // _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  user_id: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  father_name: string;

  @Prop({ required: true })
  mother_name: string;

  @Prop({ required: true, type: Date })
  dob: Date;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, select: false }) // Password is not returned by default
  password?: string;

  @Prop({ required: true, type: Address })
  present_address: Address;

  @Prop({ required: true, type: Address })
  permanent_address: Address;

  @Prop({ required: true, default: true })
  is_active: boolean;

  @Prop({ required: true, default: false })
  is_deleted: boolean;

  @Prop({
    required: true,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  })
  role: 'user' | 'admin' | 'super_admin';
}

export type UserDocument = User & Document;
export type UserModel = Model<UserDocument>;
export const UserSchema = SchemaFactory.createForClass(User);
