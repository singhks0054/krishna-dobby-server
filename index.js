import express from 'express'
import cors from 'cors'
import './db/index.js'
import dotenv from 'dotenv'

import userRouter from './routes/userRoutes.js'

dotenv.config();
const PORT = process.env.PORT
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

// All Routes 
app.use(userRouter)


app.listen(PORT, () => {
  console.log('Server is up on the port : ' + PORT)
})
