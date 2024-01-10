import Express from "express"
import router from "./app/routes/router"
import http from "http"
import cors from "cors"
import { Server } from "socket.io";

const app = Express()
const server = new http.Server(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
router(app, io)

/*
  To add asset routes
  app.use('/assets/asset_route', Express.static('assets/asset_folder'))
*/

server.listen(process.env.PORT, () => { })

export default server
