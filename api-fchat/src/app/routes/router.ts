import UserRouter from "./user/user"
import { Express} from "express"

const router = (app: Express) => {
	app.use("/user", UserRouter)
}

export default router
