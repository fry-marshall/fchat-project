import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReadMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversation_id?: string;
}
