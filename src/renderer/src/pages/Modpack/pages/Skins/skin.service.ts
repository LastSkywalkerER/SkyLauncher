import { LoadableState } from '@renderer/entities/LoadableState'
import { IUser } from '@renderer/entities/User/interfaces'
import { INodeApi } from '@renderer/shared/api/NodeApi/interfaces'
import { MicrosoftMinecraftProfile, MojangClient } from '@xmcl/user'
import { inject, injectable } from 'inversify'
import { catchError, finalize, from, Observable, switchMap, take, tap, throwError } from 'rxjs'

import { ISkinService } from './skin.interface'

@injectable()
export class SkinService extends LoadableState<MicrosoftMinecraftProfile> implements ISkinService {
  constructor(
    @inject(INodeApi.$) private readonly nodeApi: INodeApi,
    @inject(IUser.$) private readonly user: IUser
  ) {
    super()
    this.getMojangProfile = this.getMojangProfile.bind(this)
    this.setSkin = this.setSkin.bind(this)

    this.getMojangProfile().subscribe()
  }

  public getMojangProfile(): Observable<MicrosoftMinecraftProfile> {
    this.isLoaded$.next(false)
    this.isLoading$.next(true)
    this.error$.next(null)

    return this.user.data$.pipe(
      take(1),
      switchMap((userData) => {
        if (!userData?.accessToken) {
          return throwError(() => new Error('No access token available'))
        }

        return from(this.nodeApi.getMainProcessApi().getMojangProfile(userData.accessToken))
      }),
      tap((profile) => {
        this.data$.next(profile)
      }),
      catchError((error) => {
        this.error$.next(error)
        return throwError(() => error)
      }),
      finalize(() => {
        this.isLoaded$.next(true)
        this.isLoading$.next(false)
      })
    )
  }

  public setSkin(
    source: string,
    variant: 'slim' | 'classic',
    token?: string
  ): Observable<MicrosoftMinecraftProfile> {
    return from(this.setSkinAsync(source, variant, token))
  }

  private async setSkinAsync(
    source: string,
    variant: 'slim' | 'classic',
    token?: string
  ): Promise<MicrosoftMinecraftProfile> {
    const userData = this.user.data$.value
    const accessToken = token || userData?.accessToken

    if (!accessToken) {
      throw new Error('No Minecraft access token available. Please login to Minecraft first.')
    }

    try {
      const mcClient = new MojangClient()

      // Определяем тип источника: URL или путь к файлу
      const isUrl = this.isValidUrl(source)

      if (isUrl) {
        // Загрузка по URL
        const updatedProfile = await mcClient.setSkin('skin.png', source, variant, accessToken)

        this.getMojangProfile().subscribe()

        return updatedProfile as unknown as MicrosoftMinecraftProfile
      } else {
        // Загрузка из файла - добавляем валидацию для скинов
        if (!source.toLowerCase().endsWith('.png')) {
          throw new Error('Only PNG files are supported for skins')
        }

        const fileData = await this.nodeApi.getMainProcessApi().readFile(source)

        // Проверяем размер файла (max 100KB для скинов)
        const fileSize = Math.round((fileData.data.length * 3) / 4) // приблизительный размер из base64
        if (fileSize > 100 * 1024) {
          throw new Error('Skin file size exceeds 100KB limit')
        }

        const skinBuffer = Buffer.from(fileData.data, 'base64')
        const fileName = source.split('/').pop() || 'skin.png'

        const updatedProfile = await mcClient.setSkin(fileName, skinBuffer, variant, accessToken)

        this.getMojangProfile().subscribe()
        return updatedProfile as unknown as MicrosoftMinecraftProfile
      }
    } catch (error) {
      console.error('Set skin error:', error)
      throw error
    }
  }

  private isValidUrl(str: string): boolean {
    try {
      const url = new URL(str)
      return ['http:', 'https:'].includes(url.protocol)
    } catch {
      return false
    }
  }
}
