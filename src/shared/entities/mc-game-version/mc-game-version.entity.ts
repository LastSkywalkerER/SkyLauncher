import {
  defaultModpackCover,
  defaultModpackIcon,
  Modloader,
  modloaderList,
  ModpackProvider
} from '../../constants'
import {
  GameInstallationStatus,
  IMCGameVersion,
  MakeOptional,
  ServerData
} from './mc-game-version.interface'

export class MCGameVersion implements IMCGameVersion {
  public static readonly metadataDirName = 'metadata'
  public static readonly metadataJsonName = 'info.json'
  public static readonly imageFields: (keyof IMCGameVersion)[] = [
    'icon',
    'coverImage',
    'titleImage'
  ]
  public static readonly versionsFolder = 'versions'
  public static readonly worldsFolder = 'worlds'
  public static readonly modsFolder = 'mods'
  public static readonly manifestName = 'manifest.json'
  public static readonly defaultMinecraftPath = '.minecraft'

  icon: string
  name: string
  version: string
  fullVersion: string
  modpackProvider: ModpackProvider

  jsonUrl?: string
  folder?: string
  downloadUrl?: string
  forge?: string
  java?: string
  server?: ServerData
  status: GameInstallationStatus
  coverImage?: string
  titleImage?: string
  title?: string
  description?: string
  modloader?: Modloader
  modloaderVersion?: string

  constructor(data: MakeOptional<IMCGameVersion, 'icon' | 'name' | 'fullVersion'>) {
    const { fullVersion, version, modloaderVersion, modloader } =
      MCGameVersion.getParsedNewVersion(data)

    this.fullVersion = fullVersion
    this.version = version
    this.modloaderVersion = modloaderVersion
    this.modloader = modloader

    this.folder = data.folder
    this.jsonUrl = data.jsonUrl
    this.name = data.name || this.fullVersion
    this.downloadUrl = data.downloadUrl
    this.icon = data.icon || defaultModpackIcon

    this.java = data.java
    this.status = {
      modloader: false,
      libs: false,
      forge: false,
      native: false,
      assets: false,
      mods: false,
      ...data.status
    }
    this.server = data.server
    this.coverImage = data.coverImage || defaultModpackCover
    this.titleImage = data.titleImage
    this.title = data.title
    this.description = data.description
    this.modpackProvider = data.modpackProvider
  }

  public getData(): IMCGameVersion {
    return {
      folder: this.folder,
      version: this.version,
      java: this.java,
      status: this.status,
      icon: this.icon,
      fullVersion: this.fullVersion,
      name: this.name,
      downloadUrl: this.downloadUrl,
      jsonUrl: this.jsonUrl,
      server: this.server,
      coverImage: this.coverImage,
      description: this.description,
      title: this.title,
      titleImage: this.titleImage,
      modpackProvider: this.modpackProvider,
      modloaderVersion: this.modloaderVersion,
      modloader: this.modloader
    }
  }

  public update(data: Partial<IMCGameVersion>): MCGameVersion {
    Object.assign(this as object, data)
    return this
  }

  public updateStatus(status?: GameInstallationStatus): MCGameVersion {
    Object.assign(this as object, { status: { ...this.getData().status, ...status } })
    return this
  }

  public static getParsedNewVersion({
    version,
    modloaderVersion,
    fullVersion,
    modloader
  }: Partial<
    Pick<IMCGameVersion, 'version' | 'modloaderVersion' | 'modloader' | 'fullVersion'>
  >): Pick<IMCGameVersion, 'version' | 'modloaderVersion' | 'modloader' | 'fullVersion'> {
    if (fullVersion) {
      return {
        modloaderVersion,
        fullVersion,
        modloader,
        ...MCGameVersion.parseFullVersion(fullVersion)
      }
    }

    const localFullVersion =
      version && modloader && modloaderVersion
        ? `${version}-${modloader}-${modloaderVersion}`
        : version

    return {
      fullVersion: localFullVersion!,
      version: version!,
      modloader: modloader!,
      modloaderVersion: modloaderVersion!
    }
  }

  public updateVersion(
    data: Partial<
      Pick<IMCGameVersion, 'version' | 'modloaderVersion' | 'modloader' | 'fullVersion'>
    >
  ): MCGameVersion {
    Object.assign(
      this as object,
      MCGameVersion.getParsedNewVersion({
        version: data.version || this.version,
        modloaderVersion: data.modloaderVersion || this.modloaderVersion,
        fullVersion: data.fullVersion,
        modloader: data.modloader || this.modloader
      })
    )

    return this
  }

  public static parseFullVersion(fullVersion: string): {
    version: string
    modloader?: Modloader
    modloaderVersion?: string
  } {
    const [version, modloader, modloaderVersion] = fullVersion.split('-')

    if (modloader && modloaderList.includes(modloader as Modloader)) {
      return {
        modloader: modloader as Modloader,
        modloaderVersion,
        version
      }
    }

    if (modloader && !modloaderList.includes(modloader as Modloader)) {
      throw Error(`Unsupported modloader ${modloader}`)
    }

    return {
      version
    }
  }
}
