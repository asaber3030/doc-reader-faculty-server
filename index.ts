import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

import { showAppURLCMD } from "./utlis/helpers";
import { authRouter, subjectRouter, facultiesDataRouter, userRouter, facultyRouter, moduleRouter, lecturesRouter, finalRevisionRouter, practicalRouter } from "./routes";

import bcrypt from 'bcrypt'
import db from "./utlis/db";

dotenv.config();

const port = process.env.APP_PORT!

const app = express();

app.use(cors())
app.use(express.json())

app.use('/api/v1', [
  authRouter,
  facultiesDataRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter,
  lecturesRouter,
  finalRevisionRouter,
  practicalRouter
])

app.get('/', async (_, res) => {
  const password = await bcrypt.hash("123456789", 10)
  return res.status(200).json({
    message: "Faculty API - Documentation",
    info: "To start using the api head to this route: /api/login",
    status: 200,
    password
  })
  console.log('')
})

app.listen(port, () => { 
  showAppURLCMD(port!)
})

export default app