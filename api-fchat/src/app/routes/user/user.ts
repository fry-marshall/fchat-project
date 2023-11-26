import Express from "express"
import UserController from "../../controllers/user-controller"
import * as userMiddlewares from "./middlewares"
import GlobalMiddlewares from "../global-middlewares"

const router = Express.Router()


router.get(
    '/', 
    Express.json(),
    GlobalMiddlewares.verifyToken,
    UserController.getAll
)

router.get(
    '/:id', 
    Express.json(),
    GlobalMiddlewares.verifyToken,
    UserController.getUser
)

router.post(
    '/create', 
    Express.json(), 
    UserController.insert
)

router.post(
    '/login',
    Express.json(), 
    UserController.logIn
)
router.post(
    '/refreshtoken',
    Express.json(), 
    UserController.refreshToken
)

router.post(
    '/logout',
    Express.json(), 
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    UserController.logOut
)

router.put(
    '/update/generatetoken/email',
    Express.json(), 
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    UserController.generateEmailToken
)

router.put(
    '/update/verify/email',
    Express.json(),
    UserController.verifyEmail
)

router.put(
    '/update/forgotpassword',
    Express.json(), 
    UserController.forgotPassword
)

router.put(
    '/update/forgotpassword/change',
    Express.json(), 
    UserController.changeForgotPassword
)

router.put(
    '/update',
    Express.json(), 
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    UserController.update
)

router.put(
    '/update/profile_img',
    Express.json(), 
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    UserController.updateProfileImg
)

router.delete(
    '/delete',
    Express.json(), 
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    UserController.delete
)

export default router
