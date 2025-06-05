import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // create an user
  @Post()
  create(): string {
    return 'User created';
  }

  // get all users
  @Get()
  findAll(): string[] {
    return ['Ruhan', 'Taahia'];
  }
}
