import { arch, platform } from '../../../shared/constants'

const defaultConfig = {
  hardware: {
    platform: platform,
    architecture: arch
  },
  curseForgeApiKey: import.meta.env.MAIN_VITE_CURSEFORGE_APIKEY,
  javaBaseUrl: import.meta.env.MAIN_VITE_JAVA_BASE_URL,
  isDev: import.meta.env.DEV
}

export default (): typeof defaultConfig => defaultConfig
