/*
|--------------------------------------------------------------------------
| MinIO Bucket Initialization
|--------------------------------------------------------------------------
|
| This file initializes the MinIO bucket if it doesn't exist.
| It uses the S3 SDK to check for bucket existence and create it if needed.
|
*/

import { CreateBucketCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Initialize MinIO bucket
 * This function checks if the bucket exists and creates it if it doesn't
 */
async function initializeMinioBucket() {
  const bucketName = env.get('S3_BUCKET')
  const endpoint = env.get('S3_ENDPOINT')

  if (!endpoint || env.get('NODE_ENV') !== 'development') {
    return
  }

  const s3Client = new S3Client({
    endpoint,
    region: env.get('AWS_REGION'),
    credentials: {
      accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
    },
    forcePathStyle: true,
  })

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
    logger.info(`Bucket "${bucketName}" already exists`)
  } catch (error) {
    // If bucket doesn't exist (404), create it
    if (error.$metadata?.httpStatusCode === 404) {
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }))
        logger.info(`Bucket "${bucketName}" created successfully`)
      } catch (createError) {
        logger.error(`Failed to create bucket "${bucketName}":`, createError)
      }
    } else {
      logger.error(`Error checking bucket "${bucketName}":`, error)
    }
  }
}

// Initialize bucket on application start
await initializeMinioBucket()
