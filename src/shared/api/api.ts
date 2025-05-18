import { MsalAuthResponse } from '@shared/dtos/msal.dto'
import { MicrosoftMinecraftProfile } from '@xmcl/user'
import { IpcRenderer, ipcRenderer } from 'electron'

import { IPCHandleNames, IPCSendNames } from '../constants'
import { type ConfigKeys, type UserConfigData } from '../dtos/config.dto'
import { FolderPathDto } from '../dtos/filesystem.dto'
import {
  type GameData,
  type GameDataWithUser,
  type LauncherInfo,
  type PartialGameData
} from '../dtos/launcher.dto'
import { type ProcessProgressData } from '../dtos/process-progress.dto'
import { type RequestData, type ResponseData } from '../dtos/request.dto'
import { type IMCGameVersion } from '../entities/mc-game-version/mc-game-version.interface'

export const rendererApi = {
  getLocalMCVersions: (): Promise<IMCGameVersion[]> =>
    ipcRenderer.invoke(IPCHandleNames.GetLocalMCVersions),
  launchGame: (data: GameDataWithUser): Promise<void> =>
    ipcRenderer.invoke(IPCHandleNames.LaunchGame, data),
  installGame: (data: GameData): Promise<IMCGameVersion> =>
    ipcRenderer.invoke(IPCHandleNames.InstallGame, data),
  updateGame: (data: GameData): Promise<IMCGameVersion> =>
    ipcRenderer.invoke(IPCHandleNames.UpdateGame, data),
  updateLocalMCVersion: (data: PartialGameData): Promise<void> =>
    ipcRenderer.invoke(IPCHandleNames.UpdateLocalMCVersion, data),

  setConfig: (data: UserConfigData): Promise<void> =>
    ipcRenderer.invoke(IPCHandleNames.SetConfig, data),
  getConfig: <T extends ConfigKeys>(data: T): Promise<Required<UserConfigData>[T]> =>
    ipcRenderer.invoke(IPCHandleNames.GetConfig, data),

  setLogger: (logTracer: (data: string) => void): IpcRenderer =>
    ipcRenderer.on(IPCSendNames.UserLog, (_, message: string) => logTracer(message)),
  subscripbeOnProgress: (subscriber: (data: ProcessProgressData) => void): IpcRenderer =>
    ipcRenderer.on(IPCSendNames.ProcessProgress, (_, message: ProcessProgressData) =>
      subscriber(message)
    ),

  request: (data: RequestData): Promise<ResponseData> =>
    ipcRenderer.invoke(IPCHandleNames.Request, data),

  openFolder: (data: FolderPathDto): Promise<string> =>
    ipcRenderer.invoke(IPCHandleNames.OpenFolder, data),
  removeFolder: (data: FolderPathDto): Promise<void> =>
    ipcRenderer.invoke(IPCHandleNames.RemoveFolder, data),

  getLauncherInfo: (): Promise<LauncherInfo> => ipcRenderer.invoke(IPCHandleNames.GetLauncherInfo),

  loginWithMicrosoft: (): Promise<MsalAuthResponse> =>
    ipcRenderer.invoke(IPCHandleNames.LoginWithMicrosoft),
  logoutMicrosoft: (): Promise<void> => ipcRenderer.invoke(IPCHandleNames.LogoutMicrosoft),
  getMojangProfile: (accessToken: string): Promise<MicrosoftMinecraftProfile> =>
    ipcRenderer.invoke(IPCHandleNames.GetMojangProfile, accessToken)
}
