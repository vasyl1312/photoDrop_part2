import express, { Request, Response } from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import { sql } from 'drizzle-orm'
import connect from '../db/dbConnect'
import { users, TNewUsers } from '../db/schema/users'
dotenv.config()

const router = express.Router()

const loginRouter = () => {
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { phone } = req.body
      const db = await connect()

      const existingUser = await db
        .select()
        .from(users)
        .where(sql`${users.phone} = ${phone}`)
        .execute()

      let verificationToken = generateSixDigitCode()

      //if user exist=update
      if (existingUser.length > 0) {
        await db
          .update(users)
          .set({ verificationToken })
          .where(sql`${users.phone} = ${phone}`)
          .execute()
        //else create user
      } else {
        const newUser: TNewUsers = {
          phone,
          verificationToken,
        }
        await db.insert(users).values(newUser).execute()
      }

      const botToken = process.env.BOT_TOKEN
      const botApiEndpoint = `https://api.telegram.org/bot${botToken}/sendMessage`
      const chatId = process.env.CHAT_ID

      //send message to Telegram
      const response = await axios.post(botApiEndpoint, {
        chat_id: chatId,
        text: `The phone number which you try to auth:\n ${phone}\n\nAuthentication code:\n ${verificationToken}`,
      })

      if (response.data.ok) {
        return res.status(200).json({
          phone,
          code: verificationToken,
        })
      } else {
        console.error('Telegram API error:', response.data)
        return res.status(500).json({ error: 'Failed to send authentication code' })
      }
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).send('Internal Server Error')
    }
  })

  return router
}

export default loginRouter

function generateSixDigitCode() {
  const min = 100000
  const max = 999999
  return String(Math.floor(Math.random() * (max - min + 1)) + min)
}
