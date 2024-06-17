import Docker from 'dockerode'

import { wrapError } from './utils'

export function buildImage(
  docker: Docker,
  imageBuildContext: Docker.ImageBuildContext,
  imageBuildOptions: Docker.ImageBuildOptions,
) {
  return new Promise<void>((resolve, reject) =>
    docker.buildImage(imageBuildContext, imageBuildOptions, (error, result) => {
      if (error) {
        reject(wrapError(error))
        return
      }

      if (result) {
        result.pipe(process.stdout, { end: true })
        result.on('end', resolve)
      }
    }),
  )
}
