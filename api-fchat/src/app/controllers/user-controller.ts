import Controller from "./controller";
import { Request, Response } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import Service from "../services/service";
import UserService from "../services/user-service";
import { User, UserAttributes, UserInstance } from "../models/user";
import Helpers from "../../helpers/helpers";
import { TokenBlackList } from "../models/tokenblacklist";

class UserController extends Controller {
  
    constructor(service: Service) {
        super(service);
    }  

    // to getAll the users
    async getAll(req: Request, res: Response) {
        try {

            const user = res.locals.user
            let users = await User.findAll({
                where: {
                    email_verified: true
                },
                attributes: [
                    'id',
                    'fullname',
                    'description',
                    'email',
                    'profile_img'
                ]
            })

            return res.status(200).json(Helpers.queryResponse({users, currentUserId: user.id}))

        }catch(error){
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to get a user
    async getUser(req: Request, res: Response) {
        try {

            let user = await User.findOne({
                where: {
                    email_verified: true,
                    id: req.params?.id
                },
                attributes: [
                    'id',
                    'fullname',
                    'description',
                    'profile_img'
                ]
            })

            if(!user){
                return res.status(404).json(Helpers.notFoundError)
            }

            return res.status(200).json(Helpers.queryResponse({user}))

        }catch(error){
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to create an account
    async insert(req: Request, res: Response) {
        try {
            if (req.body.password && req.body.password.length < 8) {
                const error = { msg: 'fields errors', fields: [ {status: 'len', name: 'password'} ] }
                return res.status(400).json(Helpers.queryError(error))
            }
            const body: Partial<UserAttributes> = {
                id: uuidv4(),
                fullname: req.body?.fullname,
                description: req.body?.description,
                email: req.body?.email,
                email_verified_token: uuidv4(),
                email_expiredtime: Helpers.timeAfterSecond(600).toString(),
                password: req.body?.password,
            }

            const response = await this.service.insert(body)

            if (response.is_error){
                console.log(response)
                return res.status(400).send(response);
            }

            // send the verification email
            const url = `${process.env.AUTH_URL}/verifyemail?token=${(response as any).data.email_verified_token}`
            await Helpers.mailTransporter.sendMail({
                from: process.env.MAIL_USERNAME,
                to: body.email,
                subject: 'Vérification de l\'adresse mail',
                html: Helpers.verifyEmail(body.email!, url),
            })

            return res.status(201).json(Helpers.queryResponse({id: (response as any).data.id, msg: 'User account created successfully'}))

        } catch (e) {
            console.log(e)
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to log in an account
    async logIn(req: Request, res: Response) {
        try {

            let isError = false;
            let fieldsErrors = []

            if(!req.body.login){
                isError = true;
                fieldsErrors.push({
                    name: 'login',
                    status: 'is_null'
                })
            }

            if(!req.body.password){
                isError = true;
                fieldsErrors.push({
                    name: 'password',
                    status: 'is_null'
                })
            }

            if(isError){
                return res.status(400).json(Helpers.queryError({msg: 'fields errors', fields: fieldsErrors}))
            }

            let currentUser = await User.findOne({
                where: {
                    email: req.body.login
                }
            })

            if(!currentUser){
                return res.status(404).json(Helpers.notFoundError)
            }

            const passwordIsGood = bcrypt.compareSync(req.body.password, currentUser.password!);
            if(!passwordIsGood){
                return res.status(404).json(Helpers.notFoundError)
            }

            const access_token = jwt.sign({ id: currentUser.id }, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '1h'})
            const refresh_token = jwt.sign({ id: currentUser.id }, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '7d'})

            return res.status(200).json(Helpers.queryResponse({access_token, refresh_token}))

        }catch(error){
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to log out an account
    async logOut(req: Request, res: Response) {

        try {
            const token = res.locals.token
            await TokenBlackList.create({id: uuidv4(),token})
            return res.status(200).json(Helpers.queryResponse('user logout successfully'))
        }catch(error){
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to verify the email adress
    async verifyEmail(req: Request, res: Response) {
        try {
            const token = req.query.token

            if(!token){
                return res.status(400).json(Helpers.queryError({msg: 'token argument is missing'})) 
            }

            const user = await User.findOne({
                where: {
                    email_verified_token: token as string
                }
            })

            if(!user){
                return res.status(404).json(Helpers.notFoundError)
            }

            if(user.email_verified){
                return res.status(400).json(Helpers.queryError({status: 'verified', msg: 'Email already verified'}))
            }

            const expireTime = parseInt(user.email_expiredtime!) - Math.floor(Date.now() / 1000)
            if (expireTime <= 0) {
                return res.status(400).json(Helpers.queryError({status: 'expired', msg: 'Expired verification code'}))
            }

            user.email_verified = true
            await user.save()
            return res.status(202).json(Helpers.queryResponse('email verified successfully'))

        }catch(error){
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to generate a new email verified number
    async generateEmailToken(req: Request, res: Response) {
        try {
            let user = res.locals.user
            if (user.email_verified) {
                return res.status(400).json(Helpers.queryError({status: 'verified', msg: 'Email already verified'}))
            }

            user.email_verified_token = uuidv4()
            user.email_expiredtime = Math.floor(Date.now() / 1000) + 600
            await user.save()
            
            const url = `${process.env.HOST_NAME}/verifyemail?token=${user.email_verified_token}`
            await Helpers.mailTransporter.sendMail({
                from: process.env.MAIL_USERNAME,
                to: user.email,
                subject: 'Vérification de l\'adresse mail',
                html: Helpers.verifyEmail(user.email, url),
            });

            return res.status(202).json(Helpers.queryResponse('Email verification code generated successfully'))
        }catch(error){
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to update the user account        
    async update(req: Request, res: Response) {
        try {
            let user = res.locals.user as UserInstance
            let body: Partial<UserAttributes> = {
                fullname: req.body.fullname?.trim(),
                description: req.body.description?.trim(),
            }

            if (req.body.password) {
                const passwordIsGood = bcrypt.compareSync(req.body.current_password, user.password!);

                if (!passwordIsGood) {
                    const error = { msg: 'current password is incorrect', fields: [ {status: 'incorrect', name: 'current_password'} ] }
                    return res.status(400).json(Helpers.queryError(error))
                } else if(req.body.password.length < 8) {
                    const error = { msg: 'fields errors', fields: [ {status: 'len', name: 'password'} ] }
                    return res.status(400).json(Helpers.queryError(error))
                }else{
                    body.password = req.body.password
                }
            }

            const response = await this.service.update(user.id, body)

            if (response.is_error){
                return res.status(400).send(response);
            }

            return res.status(202).json(Helpers.queryResponse({id: user.id, msg: 'user account updated successfully'}))

        } catch (error) {
            return res.status(500).json(Helpers.serverError)
        } 
    }

    // to update the user account profile image     
    async updateProfileImg(req: Request, res: Response) {
        try {
            let user = res.locals.user as UserInstance
            const file = req?.file as any

            if(file){
                user.set({profile_img: file.filename})
                await user.save()
            }

            return res.status(202).json(Helpers.queryResponse({id: user.id, msg: 'user account profile img updated successfully'}))

        } catch (error) {
            return res.status(500).json(Helpers.serverError)
        } 
    }

    // to forgot the user account
    async forgotPassword(req: Request, res: Response) {
        try {
            const email = req.body.email

            if(!email){
                return res.status(400).json(Helpers.queryError({msg: 'email adress is missing'}))
            }
            
            let user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })

            if (user) {
                user.forgotpasswordtoken = uuidv4()
                user.forgotpasswordused = false
                await user.save()
                
                const url = `${process.env.HOST_NAME}/resetpassword?token=${user.forgotpasswordtoken}`

                await Helpers.mailTransporter.sendMail({
                    from: process.env.MAIL_USERNAME,
                    to: user.email,
                    subject: "Mot de passe oublié",
                    html: Helpers.resetPassword(user.email!, url),
                })
            }
            return res.status(202).json(Helpers.queryResponse('A reset password email sent successfully'))

        } catch (error) {
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to change the user account password 
    async changeForgotPassword(req: Request, res: Response) {
        try {
            const token = req.query.token
            if(!token){
                return res.status(400).json(Helpers.queryError({msg: 'token argument is missing'}))
            }

            let user = await User.findOne({
                where: {
                    forgotpasswordtoken: token as string,
                    forgotpasswordused: false
                }
            })

            if (!user) {
                return res.status(400).json(Helpers.queryError('Invalid token or email doesn\'t exist'))
            }

            if(req.body.password !== req.body.confirm_password){
                return res.status(400).json(Helpers.queryError('Password and confirmation password must be equals'))
            }

            if(req.body.password.length < 8){
                return res.status(400).json(Helpers.queryError({msg: 'fields errors', fields: [{name: 'password', status: 'len'}]}))
            }

            user.password = req.body.password
            user.forgotpasswordused = true;
            await user.save()

            return res.status(202).json(Helpers.queryResponse('password reset successfully'))

        } catch (error) {
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to delete an account
    async delete(req: Request, res: Response) {
        try {
            let user = res.locals.user
            const id = user.id
            await user.destroy()

            return res.status(202).json(Helpers.queryResponse({id, msg: 'user account deleted successfully'}))

        } catch (error) {
            return res.status(500).json(Helpers.serverError)
        }
    }
    
    async refreshToken(req: Request, res: Response) {
        try {
            const authHeader = req.headers['authorization']
            const refreshtoken = (authHeader && authHeader.split(' ')[1]) || ''

            jwt.verify(refreshtoken!, process.env.REFRESH_TOKEN_SECRET!, async (err, user: any) => {

                const token = await TokenBlackList.findOne({
                    where: {
                        token: refreshtoken
                    }
                })
                if (err || token) {
                    return res.status(401).send(Helpers.invalidAccessTokenError)
                } else {
                    const access_token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })
                    const refresh_token = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
                    await TokenBlackList.create({id: uuidv4(), token: refreshtoken ?? ''})
                    return res.status(200).json(Helpers.queryResponse({ access_token, refresh_token }))
                }
            })

        } catch (error) {
            return res.status(500).json(Helpers.serverError)
        }
    }
} 

export default new UserController(new UserService(User));

