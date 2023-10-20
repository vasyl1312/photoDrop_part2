import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { sql } from 'drizzle-orm'
import express, { Request, Response } from 'express'
import connect from '../db/dbConnect'
import { users } from '../db/schema/users'
dotenv.config()

const router = express.Router()

interface DecodedToken {
  phone: string
  iat: number
  exp: number
}

const currentRouter = () => {
  router.get('/', async (req: Request, res: Response) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        return res.status(401).json({ error: 'Token is required' })
      }
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as DecodedToken
      const phone = decoded.phone

      const db = await connect()
      const user = await db
        .select()
        .from(users)
        .where(sql`${users.phone} = ${phone}`)
        .execute()

      if (!user || user.length === 0) {
        return res.status(403).json({ error: 'Not authorized' })
      }

      const response = {
        id: user[0].id,
        avatar: user[0].avatar,
        name: user[0].name,
        email: user[0].email,
        phone: user[0].phone,
      }

      return res.status(200).json(response)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).send('Internal Server Error')
    }
  })
  return router
}

export default currentRouter
