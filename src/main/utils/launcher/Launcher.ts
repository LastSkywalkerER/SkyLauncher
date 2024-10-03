import {
  diagnose,
  launch,
  LaunchOption,
  MinecraftIssueReport,
  ResolvedVersion,
  Version
} from '@xmcl/core'
import {
  ForgeVersionList,
  getForgeVersionList,
  getVersionList,
  install,
  installForge,
  installLibraries
} from '@xmcl/installer'
import { ChildProcess } from 'node:child_process'
import { LauncherOptions } from '@main/modules/launcher/launcher.interfaces'

export class Client {
  private debugData: string[] = []
  private debugListeners: ((data: string) => void)[] = []
  private debug(...data: unknown[]): void {
    this.debugData.push(data.join(' '))
    this.debugListeners.forEach((callback) =>
      callback(
        data
          .map((object) => (typeof object === 'string' ? object : JSON.stringify(object)))
          .join(' ')
      )
    )
  }

  public async launch({
    authorization,
    forge,
    javaPath,
    memory,
    root,
    version,
    window,
    ...rest
  }: LauncherOptions & Partial<Omit<LaunchOption, 'version'>>): Promise<ChildProcess> {
    const minecraftArgs: LaunchOption = {
      gamePath: root,
      javaPath: javaPath,
      version: forge ? `${version.number}-forge-${forge}` : version.number,
      gameProfile: { name: authorization.name, id: authorization.uuid },
      //   userType: 'legacy',
      // resourcePath: root,
      minMemory: Number(memory.min),
      maxMemory: Number(memory.max),
      //   server: { ip: 'home.sky-tehnol.uk', port: 25565 },
      // nativeRoot: join(
      //   root,
      //   'versions',
      //   `${version.number}-forge-${forge}`,
      //   `${version.number}-forge-${forge}-natives`
      // ),
      resolution: window,
      ...rest
    }

    // Install main game version
    const availableVersions = await getVersionList()
    this.debug('availableVersions: ', availableVersions)
    const foundVersion = availableVersions.versions.find(({ id }) => id === version.number)
    this.debug('Installing version: ', foundVersion)
    foundVersion && (await install(foundVersion, root))
    this.debug('Installation success')

    // Validate minecraft game folder
    const resolvedVersion: ResolvedVersion = await Version.parse(root, version.number)
    this.debug('resolvedVersion: ', resolvedVersion)
    const issueReport: MinecraftIssueReport = await diagnose(
      resolvedVersion.id,
      resolvedVersion.minecraftDirectory
    )
    this.debug('issueReport: ', issueReport)

    for (const issue of issueReport.issues) {
      switch (issue.role) {
        case 'minecraftJar': // your jar has problem
        case 'versionJson': // your json has problem
        case 'library': // your lib might be missing or corrupted
        case 'asset': // some assets are missing or corrupted
        // and so on
      }
    }

    if (forge) {
      // Install forge
      const availableForgeList: ForgeVersionList = await getForgeVersionList({
        minecraft: version.number
      })
      this.debug('availableForgeList: ', availableForgeList)
      const forgeData = availableForgeList.versions.find(({ version }) => version === forge)
      this.debug('Installing forge: ', forgeData)
      forgeData && (await installForge(forgeData, root))
      this.debug('Forge installation success')
    }

    // Install platform depedth libraries (Must have)
    this.debug('Installing libraries')
    await installLibraries(resolvedVersion)
    this.debug('Libraries installed')

    this.debug('Lunch minecraft with args: ', JSON.stringify(minecraftArgs))
    const process = await launch(minecraftArgs)

    process.stdout?.setEncoding('utf-8')
    process.stdout?.on('data', (data) => this.debug('STDOUT: ', data))

    process.stderr?.setEncoding('utf-8')
    process.stderr?.on('data', (data) => this.debug('STDERR: ', data))

    return process
  }

  public onDebug(callback: (data: string) => void): void {
    this.debugListeners.push(callback)
    this.debugData.forEach((data) => callback(data))
  }
}

// const launcher = new Client()

// launcher.onDebug(console.log)

// launcher.launch({
//   root: join(__dirname, '../resources/minecraft', 'FreshCraft Industrial DLC'),
//   version: { number: '1.19.2' },
//   forge: '43.3.7',
//   authorization: { name: 'LastSkywalker', uuid: '1' },
//   javaPath: join(__dirname, '../resources/java/zulu17.52.17-ca-jre17.0.12-macosx_aarch64/bin/java'),
//   memory: { max: 8192, min: 4096 },
//   window: {
//     width: 1920,
//     height: 1080
//   },
//   extraExecOption: { detached: true }
// })
