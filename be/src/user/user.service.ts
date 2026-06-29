import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@app/user/types/CreateUserDto';
import { UserDto } from '@app/user/types/UserDto';
import { User } from '@entities/user.entity';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getUser(username: string): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOneBy({
      username: username.toLowerCase().trim(),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async getUserWithPassword(username: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({
      username: username.toLowerCase().trim(),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserById(id: number): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  private async isUserExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username: username.toLowerCase().trim() });
    return !!user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const sanitizedUsername = createUserDto.username.toLowerCase().trim();
      if (await this.isUserExists(sanitizedUsername)) {
        throw new ConflictException('Username is already taken');
      }
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
      const user = this.userRepository.create({
        username: sanitizedUsername,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      return plainToInstance(UserDto, savedUser, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findOrCreateByTelegramId(
    telegramId: string,
    telegramUsername: string | null,
  ): Promise<User> {
    const existing = await this.userRepository.findOneBy({ telegram_id: telegramId });
    if (existing) {
      return existing;
    }

    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const user = this.userRepository.create({
      username: `tg_${telegramId}`,
      password: hashedPassword,
      telegram_id: telegramId,
      telegram_username: telegramUsername ?? null,
    });
    return this.userRepository.save(user);
  }

  async linkTelegramToUser(
    userId: number,
    telegramId: string,
    telegramUsername: string | null,
  ): Promise<void> {
    const alreadyLinked = await this.userRepository.findOneBy({ telegram_id: telegramId });
    if (alreadyLinked && alreadyLinked.id !== userId) {
      throw new ConflictException('This Telegram account is already linked to another user');
    }
    await this.userRepository.update(userId, {
      telegram_id: telegramId,
      telegram_username: telegramUsername ?? null,
    });
  }
}
