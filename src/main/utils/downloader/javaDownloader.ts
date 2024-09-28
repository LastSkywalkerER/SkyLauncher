import { join } from 'path'
import { getAppDir } from '../window/getAppDir'
import { downloadAndUnzip } from './downloadAndUnzip'
// import { downloadFolder } from './downloadFolder'

export const downloadJava = async (
  version: string,
  debug: (data: string) => void
): Promise<string> =>
  downloadAndUnzip({
    bucketName: 'java',
    debug,
    destinationPath: join(await getAppDir(), 'java'),
    zipPath: process.platform === 'win32' ? join('win', 'x64') : join('mac', 'arm64'),
    version
  })
// downloadFolder({
//   bucketName: 'java',
//   debug,
//   destinationPath: join(await getAppDir(), 'java'),
//   folderName:
//     process.platform === 'win32' ? join('win', 'x64', version) : join('mac', 'arm64', version)
// })
