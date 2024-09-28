import { LauncherOptions } from '@main/utils/launcher/interfaces'

import { join } from 'path'
import { CustomLauncherOptions, Version } from '../../modules/launcher/launcher.interfaces'
import { downloadModpack } from '../downloader/modpackDownloader'
import { downloadJava } from '../downloader/javaDownloader'
import { exec } from 'child_process'
// import java from '../../../../resources/java/mac/arm64/zulu17.52.17-ca-jdk17.0.12-macosx_aarch64/bin/java?asset&asarUnpack'
// import minecraftDir from '../../../../resources/minecraft/index.jar?asset&asarUnpack'

export const getOptions = async (
  version: Version,
  launcherOptions: CustomLauncherOptions,
  logger: (data: string) => void
): Promise<LauncherOptions> => {
  const javaDir = await downloadJava(version.java, logger)
  const javaExecutable = join(javaDir, process.platform === 'win32' ? '/bin/java.exe' : '/bin/java')

  exec(`chmod -R 755 "${javaDir}"`, (error, stdout, stderr) => {
    if (error) {
      logger(`Error to chmod java: ${error.message}`)
      return
    }

    if (stderr) {
      logger(`Error: ${stderr}`)
      return
    }

    logger(`Chmod sucess: ${stdout}`)
  })

  const destinationDir = await downloadModpack(version.folder, logger)

  // if (existsSync(destinationDir)) {
  //   logger('Game folder exists')
  // } else {
  //   logger('Generating game folder...')

  //   try {
  //     cpSync(sourceDir, destinationDir, { recursive: true })
  //     logger('Game folder genereated')
  //   } catch (error) {
  //     logger(String(error))
  //   }
  // }

  return {
    authorization: {
      uuid: 'offline-uuid',
      name: launcherOptions.name
    },
    root: destinationDir,
    // root: join(minecraftDir.replace('/index.jar', ''), 'Grape Industrial DLC'),
    version: {
      number: version.version
    },
    memory: {
      max: launcherOptions.maxRam,
      min: launcherOptions.minRam
    },
    forge: version.forge,
    javaPath: javaExecutable
    // javaPath: java
  }
}
