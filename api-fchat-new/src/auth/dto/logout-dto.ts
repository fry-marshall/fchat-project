import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";


export class AuthCredentialsDto{

    @IsEmail()
    refresh_token: string;

    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'password must contain characters and numbers'
    })
    password: string;
}