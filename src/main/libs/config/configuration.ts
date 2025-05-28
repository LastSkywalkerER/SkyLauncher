import { arch, authConfig, platform } from '@shared/constants'

const defaultConfig = {
  hardware: {
    platform: platform,
    architecture: arch
  },
  auth: {
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    authority: authConfig.authority,
    redirectUri: authConfig.redirectUri
  },
  curseForgeApiKey: import.meta.env.MAIN_VITE_CURSEFORGE_APIKEY,
  javaBaseUrl: import.meta.env.MAIN_VITE_JAVA_BASE_URL,
  isDev: import.meta.env.DEV
}

export default (): typeof defaultConfig => defaultConfig
