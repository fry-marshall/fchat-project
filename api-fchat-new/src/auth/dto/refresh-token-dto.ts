import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";


export class RefreshTokenDto{

    @IsNotEmpty()
    refresh_token: string;
}