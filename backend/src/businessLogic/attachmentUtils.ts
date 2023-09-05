import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)


// the fileStogare logic
const s3Bucketname = process.env.ATTACHMENT_S3_BUCKET

export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = s3Bucketname
  ) {}

  getAttachmentUrl(itemId: string) {
    return `https://${this.bucketName}.s3.amazonaws.com/${itemId}`
  }

  getUploadUrl(itemId: string) {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: itemId,
      Expires: 300
    })
    return uploadUrl as string
  }
}