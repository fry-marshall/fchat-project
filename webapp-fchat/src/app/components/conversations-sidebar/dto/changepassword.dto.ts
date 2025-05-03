import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ChangePasswordDto {

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one upercase, one lowercase and one number',
  })
  new_password: string = '';

  @ValidateIf((o) => o.password)
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one upercase, one lowercase and one number',
  })
  confirm_new_password: string = '';
}
