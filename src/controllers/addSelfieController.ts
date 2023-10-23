import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { sql } from 'drizzle-orm'
import { Request, Response } from 'express'
import connect from '../db/dbConnect'
import { users } from '../db/schema/users'
import uploadPhotoToDb_2 from '../AWS/getUrlFromS3'
import { generatePresignedUrl } from '../AWS/helper'
import { usersSelfie, TNewUsersSelfie } from '../db/schema/selfie'
dotenv.config()

interface DecodedToken {
  phone: string
  iat: number
  exp: number
}

const addSelfieController = async (req: Request, res: Response) => {
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

    const { selfie } = req.body
    const userId = user[0].id

    const newSelfie: TNewUsersSelfie = {
      userId: userId,
      url: selfie.fileName,
    }

    const insertResult = await db.insert(usersSelfie).values(newSelfie).returning().execute()

    if (insertResult.length > 0) {
      try {
        const selfieRow = insertResult[0]

        const { id, url } = selfieRow
        let photoName = `selfie/selfie_${userId}_${id}`

        if (selfieRow.url !== null) {
          const fileNameParts = selfieRow.url.split('.')
          const fileExtension = fileNameParts?.pop()
          if (fileExtension) {
            photoName += `.${fileExtension}`
          }
        }

        const presignedUrl = await generatePresignedUrl(photoName)
        const nameFile = url

        const urlPhoto: any = await uploadPhotoToDb_2(photoName)

        await db
          .update(usersSelfie)
          .set({
            url: urlPhoto.selfieUrl,
          })
          .where(sql`${usersSelfie.userId} = ${userId}`)
          .execute()

        return res.status(200).json({ nameFile, url: presignedUrl })
      } catch (error) {
        console.error(`Error processing selfie: ${error}`)
        return res.status(500).json({ error: 'Internal server error' })
      }
    } else {
      return res.status(500).json({ error: 'Failed to insert selfie' })
    }
  } catch (error) {
    console.error(`Error: ${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default addSelfieController
