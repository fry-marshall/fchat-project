import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
