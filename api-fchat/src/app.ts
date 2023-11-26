import Express from "express"
import router from "./app/routes/router"
import http from "http"
import cors from "cors"


const app = Express()
const server = new http.Server(app)

app.use(cors())
router(app)

/*
  To add asset routes
  app.use('/assets/asset_route', Express.static('assets/asset_folder'))
*/

server.listen(process.env.PORT, () => {})

export default server
