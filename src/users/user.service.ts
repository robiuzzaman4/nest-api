import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // === generate user id func ===
  private async generateUserId() {
    const lastUser = await this.userModel.findOne().sort({ user_id: -1 });
    let nextIdNumber = 1;
    if (lastUser) {
      const lastIdNumber = parseInt(lastUser.user_id.replace('MHF', ''), 10);
      nextIdNumber = lastIdNumber + 1;
    }
    return `MHF${nextIdNumber.toString().padStart(4, '0')}`;
  }

  // === create new user ===
  async createNewUser(createUserDto: CreateUserDto) {
    try {
      const user_id = await this.generateUserId();
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        user_id,
        password: hashedPassword,
        dob: new Date(createUserDto.dob),
      });
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 11000) {
        throw new ConflictException(
          'User with this phone number or user ID already exists.',
        );
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create user',
      );
    }
  }

  // === get all users ===
  async getAllUsers() {
    return this.userModel.find();
  }

  // === get sinlge user ===
  async getSingleUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  // === update user ===
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
      },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return updatedUser;
  }

  // === delete user ===
  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        is_deleted: true,
      },
      { new: true },
    );
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return deletedUser;
  }
}
