import messageRouter from "./message/message"
import UserRouter from "./user/user"
import { Express} from "express"
import { Server } from "socket.io";

const router = (app: Express, io: Server) => {
	app.use("/message", messageRouter)
	app.use(
		"/user", 
		(req, res, next)=>{
			res.locals.io = io
			next()
		},
		UserRouter
	)
}

export default router
