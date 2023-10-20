import dotenv from 'dotenv'
import { sql } from 'drizzle-orm'
import express, { Request, Response } from 'express'
import connect from '../db/dbConnect'
import { users } from '../db/schema/users'
dotenv.config()

const router = express.Router()

const loginRouter = () => {
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { phone, code } = req.body
      const db = await connect()

      const existingUser = await db
        .select()
        .from(users)
        .where(sql`${users.phone} = ${phone}`)
        .execute()

      if (existingUser.length > 0 && existingUser[0].verificationToken === code) {
        return res.status(200).json(existingUser[0])
      } else {
        return res.status(400).json({ error: 'User not found or invalid code' })
      }
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).send('Internal Server Error')
    }
  })
  return router
}

export default loginRouter
