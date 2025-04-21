import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotpasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
