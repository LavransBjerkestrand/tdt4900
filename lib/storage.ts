import { Client } from 'minio'

export const storageClient = new Client({
  endPoint: 'storage',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER as string,
  secretKey: process.env.MINIO_ROOT_PASSWORD as string,
})
