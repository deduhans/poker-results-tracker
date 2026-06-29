import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  initData: string;
}
