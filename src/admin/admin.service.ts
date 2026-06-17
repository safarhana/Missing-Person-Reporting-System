import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {

  getUsers() {
    return {
      message: 'All users',
    };
  }

  getUser(id: string) {
    return {
      message: 'Single user',
      id,
    };
  }

  getReports() {
    return {
      message: 'All reports',
    };
  }

  filterReports(status: string) {
    return {
      message: 'Filtered reports',
      status,
    };
  }

  createUser(body: any) {
    return {
      message: 'User created',
      data: body,
    };
  }

  updateUser(id: string, body: any) {
    return {
      message: 'User updated',
      id,
      data: body,
    };
  }

  patchUser(id: string) {
    return {
      message: 'User partially updated',
      id,
    };
  }

  deleteUser(id: string) {
    return {
      message: 'User deleted',
      id,
    };
  }
}