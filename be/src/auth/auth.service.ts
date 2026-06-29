import { Injectable } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) { }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.getUserWithPassword(username);
      const passwordValid = await bcrypt.compare(password, user.password);
      if (passwordValid) {
        return { userId: user.id, username: user.username };
      }
      return null;
    } catch {
      return null;
    }
  }
}
