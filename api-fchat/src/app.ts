import Express from "express"
import router from "./app/routes/router"
import http from "http"
import cors from "cors"
import { Server } from "socket.io";
import path from "path"

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


const assetsPath = path.join(__dirname, '../assets');
app.use('/assets', Express.static(assetsPath))


server.listen(process.env.NODE_DOCKER_PORT, () => { })

export default server
