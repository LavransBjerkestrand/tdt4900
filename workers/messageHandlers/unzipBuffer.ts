import fs from 'fs'
import yauzl from 'yauzl'

import { wrapError } from './utils'

export function unzipBuffer(graderZipBuffer: Buffer, destinationPath: `${string}/`) {
  return new Promise<void>(function unzipBuffer(resolve, reject) {
    // make sure destinationPath exists
    fs.rmSync(destinationPath, { recursive: true, force: true })
    fs.mkdirSync(destinationPath, { recursive: true })

    yauzl.fromBuffer(graderZipBuffer, { lazyEntries: true }, (error, zipfile) => {
      if (error) {
        reject(wrapError(error))
        return
      }

      zipfile.readEntry()
      zipfile.on('entry', (entry) => {
        const isDirectory = /\/$/.test(entry.fileName)

        if (isDirectory) {
          fs.mkdirSync(`${destinationPath}${entry.fileName}`, { recursive: true })
          zipfile.readEntry()
        } else {
          zipfile.openReadStream(entry, (error, readStream) => {
            if (error) {
              reject(wrapError(error))
              return
            }
            readStream.on('end', () => zipfile.readEntry())

            const writeStream = fs.createWriteStream(`${destinationPath}${entry.fileName}`)
            readStream.pipe(writeStream)
          })
        }
      })

      zipfile.on('end', resolve)
    })
  })
}
