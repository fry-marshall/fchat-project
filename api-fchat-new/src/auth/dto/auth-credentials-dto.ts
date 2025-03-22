import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";


export class AuthCredentialsDto{

    @IsEmail()
    email: string;

    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'password must contain characters and numbers'
    })
    password: string;
}