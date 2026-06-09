import type { User } from '@/types/user/User';
import axiosClient from '../apiClient';
import type { Auth } from '@/types/auth/Auth';

class AuthController {
  private readonly CONTROLLER = '/auth';

  async login(auth: Auth): Promise<any> {
    const url: string = `${this.CONTROLLER}/login`;

    const response = await axiosClient.post(url, auth);

    return response.data;
  }

  async logout(): Promise<boolean> {
    const url: string = `${this.CONTROLLER}/logout`;

    const response = await axiosClient.get(url);

    return response.data;
  }

  async sessionStatus(): Promise<User | null> {
    const url: string = `${this.CONTROLLER}/sessionStatus`;

    const response = await axiosClient.get(url)
      .then((res) => {
        return res.data as User;
      }).catch(() => {
        return null;
      });

    return response;
  }
}

export default AuthController;