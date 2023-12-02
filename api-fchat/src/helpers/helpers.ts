import { verifyEmailTemplate } from "./templates/verify-email";
import nodemailer from "nodemailer"
import 'dotenv/config';
import { Twilio } from "twilio";
import { resetPasswordTemplate } from "./templates/reset-password";

class Helpers{

    public static verifyEmail = verifyEmailTemplate;
    public static resetPassword = resetPasswordTemplate;

    public static mailTransporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT!),
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    //public static smsTransporter = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    public static serverError = { is_error: true, status: 'server_error', msg: 'Unknown error occured' }
    public static notFoundError = { is_error: true, status: 'not_found', msg: 'Item not found' }
    public static accessDeniedError = { is_error: true, status: 'access_denied', msg: 'Access denied' }
    public static invalidAccessTokenError = { is_error: true, status: 'invalid_access_token', msg: 'Invalid access token' }
    public static queryResponse(data: any){
        return { is_error: false, data } 
    }
    public static queryError(errors: any){
        return { is_error: true, errors } 
    }  

    public static timeAfterSecond(second: number){
        return Math.floor(Date.now() / 1000) + second
    }

    public static getNumberFormatAccordingIndicative(indicative: string, number: string){
        let numberFormat = indicative
        switch(indicative){
            case '+33':
                numberFormat += number.substring(1)
                break;

            case '+225':
                numberFormat += number
                break;
        }
        return numberFormat
    }

}

export default Helpers;
