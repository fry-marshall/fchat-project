import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import Helpers from "../../helpers/helpers"
//import { TokenBlackList } from "../models/tokenblacklist"

export default class GlobalMiddlewares{

    public static verifyToken(req: Request, res: Response, next: NextFunction){
        const authHeader = req.headers['authorization']
        const token = ( authHeader && authHeader.split(' ')[1] ) || ''

        jwt.verify(token ?? '', process.env.ACCESS_TOKEN_SECRET!, async (err, user: any) => {


            /* let tokenExisting = await TokenBlackList.findOne({
                where: {
                    token: token
                }
            }) */
    
            if (err/*  || tokenExisting */) {
                return res.status(401).send(Helpers.invalidAccessTokenError)
            } else {
                res.locals.id = user.id
                res.locals.token = token
                next()
            }
    
        })
    }

    public static verifyRight(right: string){
        return async (req: Request, res: Response, next: NextFunction) => {
            
            if(res.locals.user.account_type !== right){
                return res.status(403).send(Helpers.accessDeniedError)
            }
            next()
        }
    }
}
