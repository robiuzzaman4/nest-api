import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';

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
  private readonly users: IUser[] = USERS;

  create(user: IUser) {
    this.users.push(user);
    return user;
  }

  findAll(): IUser[] {
    return this.users;
  }
}
