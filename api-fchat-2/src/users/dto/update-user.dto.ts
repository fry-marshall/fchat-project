import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password too weak',
  })
  password?: string;

  @IsOptional()
  profile_img?: Express.Multer.File;
}
