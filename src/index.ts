import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import loginRouter from './routes/loginRouter'
import verifyRouter from './routes/verifyRouter'
import { swaggerRouter } from './swagger/router'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 9001

app.use(['/login', '/reset'], loginRouter())
app.use('/verify', verifyRouter())
app.use('/api_docs', swaggerRouter)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
