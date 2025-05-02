import { IsEmail, IsNotEmpty, Matches, MinLength, ValidateIf } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Full name is required' })
  fullname: string = '';

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

  @ValidateIf((o) => o.password)
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one upercase, one lowercase and one number',
  })
  confirmPassword: string = '';
}
