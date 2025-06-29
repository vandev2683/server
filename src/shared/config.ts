import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'
import { z } from 'zod'

config({
  path: '.env'
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Environment file (.env) not found. Please create one with the necessary configurations.')
  process.exit(1)
}

const configSchema = z.object({
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_S3_REGION: z.string(),
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_SECRET_KEY: z.string(),
  RESEND_OTP_SECRET_KEY: z.string(),
  OTP_EXPIRES_IN: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string(),
  PAYMENT_API_KEY_SECRET: z.string()
})

const parsedConfig = configSchema.safeParse(process.env)
if (!parsedConfig.success) {
  console.error('Invalid environment variables:', parsedConfig.error.format())
  process.exit(1)
}

const envConfig = parsedConfig.data
export default envConfig
