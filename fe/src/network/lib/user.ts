import type { CreateUser } from '@/types/user/CreateUser';
import axiosClient from '../apiClient';
import type { User } from '@/types/user/User';

class UserController {
  private readonly CONTROLLER = '/users';

  async createUser(createUser: CreateUser): Promise<User> {
    const url: string = `${this.CONTROLLER}`;

    const response = await axiosClient.post(url, createUser);

    return response.data as User;
  }
}

export default UserController;