import messageRouter from "./message/message"
import UserRouter from "./user/user"
import { Express} from "express"

const router = (app: Express) => {
	app.use("/message", messageRouter)
	app.use("/user", UserRouter)
}

export default router
