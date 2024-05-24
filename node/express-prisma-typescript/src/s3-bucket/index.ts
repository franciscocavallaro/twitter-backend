import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Constants } from '@utils'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Bucket = new S3Client({
  region: Constants.BUCKET_REGION,
  credentials: {
    accessKeyId: Constants.BUCKET_ACCESS_KEY,
    secretAccessKey: Constants.BUCKET_SECRET_ACCESS_KEY
  }
})

export async function signedURL (fileName: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: Constants.BUCKET_NAME,
    Key: fileName,
    ContentType: 'multipart/form-data'
  })

  return await getSignedUrl(s3Bucket, command, { expiresIn: 3600 })
}
