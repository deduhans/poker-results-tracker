import { Body, Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from '@app/auth/local.auth.guard';
import { AuthDto } from '@app/auth/types/AuthDto';
import { TelegramAuthDto } from '@app/auth/types/TelegramAuthDto';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@app/auth/auth.service';
import { UserService } from '@app/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: AuthDto })
  async login(@Request() req): Promise<any> {
    const payload = { username: req.user.username, sub: req.user.userId };
    return {
      ...req.user,
      access_token: this.jwtService.sign(payload),
    };
  }

  @Post('/telegram')
  @ApiBody({ type: TelegramAuthDto })
  async telegramLogin(@Body() body: TelegramAuthDto): Promise<any> {
    const tgUser = this.authService.validateTelegramInitData(body.initData);
    const user = await this.userService.findOrCreateByTelegramId(
      String(tgUser.id),
      tgUser.username ?? null,
    );
    const payload = { username: user.username, sub: user.id };
    return {
      userId: user.id,
      username: user.username,
      telegram_id: user.telegram_id ?? null,
      access_token: this.jwtService.sign(payload),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/link-telegram')
  @ApiBody({ type: TelegramAuthDto })
  async linkTelegram(@Request() req, @Body() body: TelegramAuthDto): Promise<{ success: boolean }> {
    const tgUser = this.authService.validateTelegramInitData(body.initData);
    await this.userService.linkTelegramToUser(
      req.user.userId,
      String(tgUser.id),
      tgUser.username ?? null,
    );
    return { success: true };
  }

  @Get('/logout')
  async logout(): Promise<boolean> {
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/sessionStatus')
  async isLoggedIn(@Request() req): Promise<any> {
    return this.userService.getUserById(req.user.userId);
  }
}
