import { inject, injectable } from 'inversify'
import {
  catchError,
  finalize,
  from,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  withLatestFrom
} from 'rxjs'

import defaultIcon from '../../../../../resources/icons/icon.png'
import {
  IBackendApi,
  LoginData,
  LoginResponse,
  ProfileResponse,
  RegisterData
} from '../../shared/api/BackendApi/interfaces'
import { LoadableState } from '../LoadableState'
import { ISettings, LauncherSettings } from '../Settings/interfaces'
import { IUser, UserData } from './interfaces'

@injectable()
export class User extends LoadableState<UserData> implements IUser {
  private _backendApi: IBackendApi
  private _settings: ISettings

  constructor(
    @inject(IBackendApi.$) backendApi: IBackendApi,
    @inject(ISettings.$) settings: ISettings
  ) {
    super()

    this._backendApi = backendApi
    this._settings = settings

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.offlineLogin = this.offlineLogin.bind(this)
    this.getMinecraftProfile = this.getMinecraftProfile.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.init = this.init.bind(this)

    this.isLoaded$.next(true)
    this.isLoading$.next(false)

    this.init().subscribe()
  }

  public init(): Observable<[LauncherSettings | null, UserData | null]> {
    return this._settings.getSettings().pipe(
      withLatestFrom(this.data$),
      tap(([newValue, prevValue]) => {
        if (newValue?.email) {
          this.data$.next({ ...prevValue, email: newValue?.email })
        }

        if (newValue?.userName && !newValue?.accessToken) {
          this.offlineLogin({ userName: newValue?.userName }).subscribe()
        }
      })
    )
  }

  public getUser(): UserData {
    return this.data$.getValue() as UserData
  }

  public login(data: LoginData): Observable<LoginResponse> {
    return of(null).pipe(
      tap(() => this.isLoading$.next(true)),

      switchMap(() => from(this._backendApi.login(data))),

      switchMap((response: LoginResponse) =>
        this._settings.setSettings({ email: data.email }).pipe(
          tap(() => {
            this.data$.next({ email: data.email, icon: defaultIcon })
          }),
          switchMap(() => of(response))
        )
      ),

      catchError((error) => {
        this.error$.next(error as Error)
        return throwError(() => error)
      }),

      finalize(() => {
        this.isLoaded$.next(true)
        this.isLoading$.next(false)
      })
    )
  }

  public logout(): Observable<unknown> {
    this.data$.next(null)

    return from(this._settings.setDefaults()).pipe(switchMap(() => from(this._backendApi.logout())))
  }

  public register(data: RegisterData): Observable<LoginResponse> {
    return from(this._backendApi.register(data))
  }

  public offlineLogin({ userName }: UserData): Observable<void> {
    return this._settings.setDefaults().pipe(
      withLatestFrom(this.data$),

      switchMap(([, oldData]) =>
        this._settings.setSettings({ userName }).pipe(
          tap(() => {
            this.data$.next({ ...oldData, userName, icon: defaultIcon, isOffline: true })
          })
        )
      ),

      catchError((error) => {
        this.error$.next(error as Error)
        return throwError(() => error)
      }),

      finalize(() => {
        this.isLoaded$.next(true)
        this.isLoading$.next(false)
      })
    )
  }

  public async getMinecraftProfile(): Promise<void> {
    const oldData = this.data$.getValue()

    if (oldData?.isOffline) {
      return
    }

    this.isLoaded$.next(false)
    this.isLoading$.next(true)

    try {
      const response = await this._backendApi.getMinecraftProfile()

      if (!response?.username) {
        throw Error('Something went wrong')
      }

      this._settings.setSettings({
        userName: response.username,
        userId: response.uuid,
        accessToken: response.minecraft_access_token,
        minecraftAccessExpiration: response.minecraft_access_expires_in
      })

      this.data$.next({ ...oldData, userName: response.username })
    } catch (error) {
      this.error$.next(error as Error)
    } finally {
      this.isLoaded$.next(true)
      this.isLoading$.next(false)
    }
  }

  public async getProfile(): Promise<ProfileResponse> {
    const response = await this._backendApi.getProfile()

    return response
  }
}
