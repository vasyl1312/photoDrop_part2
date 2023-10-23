import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import userRouter from './routes/userRouter'
import loginRouter from './routes/loginRouter'
import verifyRouter from './routes/verifyRouter'
import currentRouter from './routes/currentRouter'
import { swaggerRouter } from './swagger/router'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 9001

app.use('/user', userRouter)
app.use('/verify', verifyRouter())
app.use('/current', currentRouter())
app.use('/api_docs', swaggerRouter)
app.use(['/login', '/reset'], loginRouter())

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
