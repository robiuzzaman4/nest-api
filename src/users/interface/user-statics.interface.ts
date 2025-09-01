import { UserDocument } from '../schema/user.schema';

// === custom statics interface ===
export interface UserStatics {
  isActive(id: string): Promise<UserDocument | null>;
  isDeleted(id: string): Promise<UserDocument | null>;
  existsByPhone(phone: string): Promise<boolean>;
}
