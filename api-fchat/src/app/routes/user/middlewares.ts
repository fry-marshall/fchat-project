import {Request, Response, NextFunction} from "express";
import { User } from "../../models/user";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  let currentUser = await User.findByPk(res.locals.id)
  if (!currentUser) {
    const validationErrors = { error: { name: 'not_found', status: 404, message: 'Item not found' } }
    return res.status(404).send({ is_error: true, value: validationErrors })
  }
  res.locals.user = currentUser
  next()
}

const hasPhoneVerified = (req: Request, res: Response, next: NextFunction) => {
  let currentUser = res.locals.user

  if (currentUser.phone_verified) {
    const validationErrors = { error: { name: 'access_denied', status: 403, message: 'Phone not verified' } }
    return res.status(403).send({ is_error: true, value: validationErrors })
  }
  next()
}

const hasEmailVerified = (req: Request, res: Response, next: NextFunction) => {
  let currentUser = res.locals.user

  if (currentUser.email_verified) {
    const validationErrors = { error: { name: 'access_denied', status: 403, message: 'Email not verified' } }
    return res.status(403).send({ is_error: true, value: validationErrors })
  }
  next()
}

export { hasEmailVerified, hasPhoneVerified, getUser }
