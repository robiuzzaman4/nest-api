import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Generates a new user_id by finding the last one and incrementing it
  private async generateUserId(): Promise<string> {
    const lastUser = await this.userModel
      .findOne()
      .sort({ user_id: -1 })
      .exec();
    let nextIdNumber = 1;
    if (lastUser) {
      const lastIdNumber = parseInt(lastUser.user_id.replace('MHF', ''), 10);
      nextIdNumber = lastIdNumber + 1;
    }
    return `MHF${nextIdNumber.toString().padStart(4, '0')}`;
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user_id = await this.generateUserId();
      const newUser = new this.userModel({
        ...createUserDto,
        user_id,
        dob: new Date(createUserDto.dob),
      });
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error); // Log the full error object
      if (error.code === 11000) {
        throw new ConflictException(
          'User with this phone number already exists.',
        );
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create user',
      );
    }
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Retrieve a user by their MongoDB _id
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update a user by their MongoDB _id
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDto,
          dob: updateUserDto.dob ? new Date(updateUserDto.dob) : undefined,
        },
        { new: true }, // Return the updated document
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Delete a user by their MongoDB _id
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
