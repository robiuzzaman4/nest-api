import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

const USERS = [
  {
    id: 'u-1',
    name: 'Taahia',
  },
  {
    id: 'u-2',
    name: 'Ruhan',
  },
];

@Injectable()
export class UsersService {
  private readonly users: User[] = USERS;

  create(user: User) {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}
