import Express from "express"
import MessageController from "../../controllers/message-controller"
import GlobalMiddlewares from "../global-middlewares"
import * as userMiddlewares from "../user/middlewares"

const router = Express.Router()

router.post(
    '/send', 
    Express.json(),
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    MessageController.sendMessage
)

router.get(
    '/', 
    Express.json(),
    GlobalMiddlewares.verifyToken,
    userMiddlewares.getUser,
    MessageController.getAll
)

export default router
