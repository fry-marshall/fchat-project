import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ChangeForgotPasswordDto {
  @IsNotEmpty()
  token: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must contain characters and numbers',
  })
  password: string;
}
