import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetpasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password too weak',
  })
  password: string;
}
