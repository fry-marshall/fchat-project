import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ProfileDto {

  @IsNotEmpty({ message: 'Fullname is required' })
  @MinLength(2, {
    message: 'Name must contain at least 2 characters',
  })
  fullname: string = '';

  @MinLength(10, {
    message: 'Description must contain at least 10 characters',
  })
  description: string = '';
}
