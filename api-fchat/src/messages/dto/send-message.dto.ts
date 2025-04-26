import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  user_id?: string;

  @IsNotEmpty()
  @IsString()
  content?: string;
}
