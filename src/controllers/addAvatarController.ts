import * as fs from 'fs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { sql } from 'drizzle-orm'
import cloudinary from 'cloudinary'
import { Request, Response } from 'express'
import connect from '../db/dbConnect'
import { users } from '../db/schema/users'
import upload from '../helper/multerConfig'

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

dotenv.config()

interface DecodedToken {
  phone: string
  iat: number
  exp: number
}

const setAvatar = async (req: Request, res: Response) => {
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

    const uploadMiddleware = upload.single('avatar')
    uploadMiddleware(req, res, async function (err) {
      if (err) {
        console.error('Multer Error:', err)
        return res.status(400).json({ error: err.message })
      }

      const file: any = req.file
      if (!file) {
        return res.status(400).send('No file uploaded.')
      }

      const allowedExtensions = ['.jpg', '.jpeg', '.png']
      const fileExtension = '.' + (file.originalname.split('.').pop() || '')

      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        return res.status(400).send('Invalid file type. Only JPEG, JPG and PNG images are allowed.')
      }

      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).send('File size exceeds the limit.')
      }

      try {
        const result = await cloudinary.v2.uploader.upload(file.path)
        fs.unlinkSync(file.path)

        const imageUrl: string = result.secure_url

        await db
          .update(users)
          .set({
            avatar: imageUrl,
          })
          .where(sql`${users.phone} = ${phone}`)
          .execute()

        return imageUrl
      } catch (error) {
        console.error('Cloudinary Error:', error)
        return res.status(500).send('Error uploading image to Cloudinary.')
      }
    })

    return res.status(200).send('Avatar changed successfully')
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).send('Internal Server Error')
  }
}

export default setAvatar
