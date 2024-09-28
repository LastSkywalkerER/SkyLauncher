import { join } from 'path'
// import { downloadFolder } from './downloadFolder'
import { getAppDir } from '../window/getAppDir'
import { downloadAndUnzip } from './downloadAndUnzip'

export const downloadModpack = async (
  name: string,
  debug: (data: string) => void
): Promise<string> =>
  // downloadFolder({
  //   bucketName: 'modpacks',
  //   debug,
  //   destinationPath: join(await getAppDir(), 'modpacks'),
  //   folderName: name
  // })
  downloadAndUnzip({
    bucketName: 'modpacks',
    debug,
    destinationPath: join(await getAppDir(), 'modpacks'),
    version: name,
    zipPath: '/'
  })
