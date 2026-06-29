import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.getUserWithPassword(username);
      const passwordValid = await bcrypt.compare(password, user.password);
      if (passwordValid) {
        return { userId: user.id, username: user.username, telegram_id: user.telegram_id ?? null };
      }
      return null;
    } catch {
      return null;
    }
  }

  validateTelegramInitData(initData: string): TelegramUser {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    if (!botToken) {
      throw new UnauthorizedException('Telegram bot not configured');
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) {
      throw new UnauthorizedException('Missing hash in initData');
    }

    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const expectedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (expectedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram initData signature');
    }

    const userStr = params.get('user');
    if (!userStr) {
      throw new UnauthorizedException('Missing user in initData');
    }

    return JSON.parse(userStr) as TelegramUser;
  }
}
