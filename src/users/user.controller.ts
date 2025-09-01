import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // === create user ===
  @Post()
  async createNewUser(
    @Body(new ZodValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.usersService.createNewUser(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // === get all users ===
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully.',
      data: users,
    };
  }

  // === get user by id ===
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully.',
      data: user,
    };
  }

  // === update user ===
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully.',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // === delete user [soft] ===
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.deleteUser(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully.',
      data: deletedUser,
    };
  }
}
