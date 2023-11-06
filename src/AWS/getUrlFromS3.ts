import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const bucket = process.env.AWS_BUCKET_NAME_STORAGE

const s3ClientConfig: S3ClientConfig = {
  region: `${process.env.AWS_BUCKET_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY1}`,
    secretAccessKey: `${process.env.AWS_SECRET_KEY1}`,
  },
}

const s3Client = new S3Client(s3ClientConfig)

async function getSignedDownloadUrl(path: any) {
  let command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
    ResponseExpires: new Date('2025-01-01'),
  })
  return await getSignedUrl(s3Client, command)
}

const uploadPhotoToDb_2 = async (photoName: string) => {
  try {
    const selfieUrl = await getSignedDownloadUrl(`${photoName}`)
    return { selfieUrl }
  } catch (error) {
    console.error('Error:', error)
    return error
  }
}

export default uploadPhotoToDb_2

//https://photo-drop-3-updated.s3.eu-central-1.amazonaws.com/selfie/selfie_4b81ddb7-670b-4210-8ab7-ad54beed4837_409a8bf8-d82c-4ee9-816d-312c275494af.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATS5BI5YUWRUMCD6Q%2F20231101%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20231101T070620Z&X-Amz-Expires=900&X-Amz-Signature=bb32c2161ad2c12d6931fda5e6216f74af45ce7c80f04cc7f6393a809647d0a4&X-Amz-SignedHeaders=host&response-expires=Wed%2C%2001%20Jan%202025%2000%3A00%3A00%20GMT&x-id=GetObject
