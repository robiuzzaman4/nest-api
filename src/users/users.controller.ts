import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // create an user
  @Post()
  create(@Body() CreateUserDto: CreateUserDto): CreateUserDto {
    return this.usersService.create(CreateUserDto);
  }

  // get all users
  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }
}
