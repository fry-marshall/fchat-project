import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value?.trim() : ''))
  refresh_token: string;
}
