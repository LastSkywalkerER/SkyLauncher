import { IpcRenderer, ipcRenderer } from 'electron'
import { IPCHandleNames, IPCSendNames } from '../constants'
import { type ConfigKeys, type UserConfigData } from '../dtos/config.dto'
import { type ProcessProgressData } from '../dtos/process-progress.dto'
import { type IMCGameVersion } from '../entities/mc-game-version/mc-game-version.interface'
import { type GameData } from '../dtos/launcher.dto'

export const rendererApi = {
  getCustomMCVersions: (): Promise<IMCGameVersion[]> =>
    ipcRenderer.invoke(IPCHandleNames.GetCustomMCVersions),
  getLocalMCVersions: (): Promise<IMCGameVersion[]> =>
    ipcRenderer.invoke(IPCHandleNames.GetLocalMCVersions),
  launchGame: (data: GameData): Promise<void> =>
    ipcRenderer.invoke(IPCHandleNames.LaunchGame, data),
  checkGame: (data: GameData): Promise<IMCGameVersion> =>
    ipcRenderer.invoke(IPCHandleNames.CheckGame, data),
  installGame: (data: GameData): Promise<IMCGameVersion> =>
    ipcRenderer.invoke(IPCHandleNames.InstallGame, data),
  setConfig: (data: UserConfigData): Promise<void> =>
    ipcRenderer.invoke(IPCHandleNames.SetConfig, data),
  getConfig: (data: ConfigKeys): Promise<unknown> =>
    ipcRenderer.invoke(IPCHandleNames.GetConfig, data),
  setLogger: (logTracer: (data: string) => void): IpcRenderer =>
    ipcRenderer.on(IPCSendNames.UserLog, (_, message: string) => logTracer(message)),
  subscripbeOnProgress: (subscriber: (data: ProcessProgressData) => void): IpcRenderer =>
    ipcRenderer.on(IPCSendNames.ProcessProgress, (_, message: ProcessProgressData) =>
      subscriber(message)
    )
}