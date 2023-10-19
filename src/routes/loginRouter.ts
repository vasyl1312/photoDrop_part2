import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const router = express.Router()

const loginRouter = () => {
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { phone } = req.body

      const authenticationCode = generateSixDigitCode()

      const botToken = process.env.BOT_TOKEN
      const botApiEndpoint = `https://api.telegram.org/bot${botToken}/sendMessage`
      const chatId = process.env.CHAT_ID

      const response = await axios.post(botApiEndpoint, {
        chat_id: chatId,
        text: `The phone number which you try to auth:\n ${phone}\n\nAuthentication code:\n ${authenticationCode}`,
      })

      if (response.data.ok) {
        return res.status(200).json({
          phone,
          code: authenticationCode,
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
