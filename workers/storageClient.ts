import * as Minio from 'minio'

export const storageClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'storage_user',
  secretKey: 'storage_password',
})
