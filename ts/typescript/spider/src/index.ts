import express, { Request, Response, NextFunction } from "express"
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session'
import router from "./router"

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'dell'
  next()
})

app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher'],
    maxAge: 24 * 60 * 60 * 1000
  })
)

app.use(router)

app.listen(7001, () => {
  console.log("serve is start on 7001");
})