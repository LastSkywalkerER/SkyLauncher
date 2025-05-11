import { ErrorResponse } from '@renderer/shared/api/BackendApi/interfaces'
import { inject, injectable } from 'inversify'
import {
  catchError,
  finalize,
  from,
  map,
  merge,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  withLatestFrom
} from 'rxjs'

import defaultIcon from '../../../../../../resources/icons/icon.png'
import {
  IBackendApi,
  LoginData,
  LoginResponse,
  MinecraftProfileResponse,
  ProfileResponse,
  RegisterData
} from '../../../shared/api/BackendApi/interfaces'
import { LoadableState } from '../..//LoadableState'
import { ISettings, LauncherSettings } from '../../Settings/interfaces'
import { IUser, UserData } from '../interfaces'

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

    this.init().subscribe()
  }

  public init(): Observable<
    [
      LauncherSettings | null,
      UserData | null,
      ProfileResponse | null,
      MinecraftProfileResponse | null
    ]
  > {
    this.isLoaded$.next(false)
    this.isLoading$.next(true)

    return this._settings.getSettings().pipe(
      withLatestFrom(this.data$),
      switchMap(([newValue, prevValue]) =>
        from(this._backendApi.getProfile()).pipe(
          switchMap((profile) => {
            if (profile?.minecraftProfile?.username) {
              return from(this._backendApi.getMinecraftProfile()).pipe(
                map(
                  (minecraftProfile) =>
                    [newValue, prevValue, profile, minecraftProfile] as [
                      LauncherSettings | null,
                      UserData | null,
                      ProfileResponse | null,
                      MinecraftProfileResponse | null
                    ]
                ),
                catchError(() =>
                  of([newValue, prevValue, profile, null] as [
                    LauncherSettings | null,
                    UserData | null,
                    ProfileResponse | null,
                    MinecraftProfileResponse | null
                  ])
                )
              )
            }
            return of([newValue, prevValue, profile, null] as [
              LauncherSettings | null,
              UserData | null,
              ProfileResponse | null,
              MinecraftProfileResponse | null
            ])
          }),
          catchError((error) => {
            if (error instanceof Error && (error.cause as ErrorResponse).status === 401) {
              this.logout().subscribe()
            }
            return of([newValue, prevValue, null, null] as [
              LauncherSettings | null,
              UserData | null,
              ProfileResponse | null,
              MinecraftProfileResponse | null
            ])
          })
        )
      ),
      tap(([newValue, prevValue, profile, minecraftProfile]) => {
        if (profile?.email && profile.email.value) {
          const data: UserData = {
            email: profile.email.value,
            role: profile.role
          }

          if (minecraftProfile?.username) {
            data.userName = minecraftProfile.username
            data.userId = minecraftProfile.uuid
            data.accessToken = minecraftProfile.minecraft_access_token
          }

          this.data$.next({
            ...this.data$.getValue(),
            ...data
          })

          return
        }

        if (newValue?.email) {
          this.data$.next({ ...prevValue, email: newValue.email })
        }

        if (newValue?.userName && !newValue?.accessToken) {
          this.offlineLogin({ userName: newValue.userName }).subscribe()
        }
      }),
      finalize(() => {
        this.isLoaded$.next(true)
        this.isLoading$.next(false)
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
          switchMap(() => from(this._backendApi.getProfile())),
          tap((profile) => {
            if (profile?.email?.value) {
              this.data$.next({
                ...this.data$.getValue(),
                email: profile.email.value,
                // userName: profile.minecraftProfile?.username,
                role: profile.role
              })
            }
          }),
          switchMap((profile) => {
            if (profile?.minecraftProfile?.username) {
              return from(this._backendApi.getMinecraftProfile()).pipe(
                tap((minecraftProfile) => {
                  if (minecraftProfile?.username) {
                    this.data$.next({
                      ...this.data$.getValue(),
                      userName: minecraftProfile.username,
                      userId: minecraftProfile.uuid,
                      accessToken: minecraftProfile.minecraft_access_token
                    })
                  }
                }),
                map(() => profile)
              )
            }
            return of(profile)
          }),
          map(() => response)
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
    this.isLoaded$.next(false)
    this.isLoading$.next(true)

    return merge(
      of(null).pipe(
        tap(() => this.data$.next(null)),
        catchError((error) => {
          this.error$.next(error as Error)
          return of(null)
        })
      ),
      from(this._settings.setDefaults()).pipe(
        catchError((error) => {
          this.error$.next(error as Error)
          return of(null)
        })
      ),
      from(this._backendApi.logout()).pipe(
        catchError((error) => {
          this.error$.next(error as Error)
          return of(null)
        })
      )
    ).pipe(
      finalize(() => {
        this.isLoaded$.next(true)
        this.isLoading$.next(false)
      })
    )
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
