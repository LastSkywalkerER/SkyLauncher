import { defaultModpackCover, defaultModpackIcon } from '../../../../shared/constants'

export const environment = {
  serverPort: import.meta.env.RENDERER_VITE_PORT,
  serverIp: import.meta.env.RENDERER_VITE_IP,
  baseURL: import.meta.env.RENDERER_VITE_BASE_URL,
  curseForgeApiKey: import.meta.env.RENDERER_VITE_CURSEFORGE_APIKEY,
  websiteLink: import.meta.env.RENDERER_VITE_WEB_URL,
  termsLink: import.meta.env.RENDERER_VITE_TERMS_URL,
  xboxConnectionLink: import.meta.env.RENDERER_VITE_XBOX_URL,
  defaultModpackIcon: import.meta.env.RENDERER_VITE_COVER_URL || defaultModpackIcon,
  defaultModpackCover: import.meta.env.RENDERER_VITE_CURSEFORGE_APIKEY || defaultModpackCover
}
