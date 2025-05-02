import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignInDto {

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string = '';

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one upercase, one lowercase and one number',
  })
  password: string = '';
}
