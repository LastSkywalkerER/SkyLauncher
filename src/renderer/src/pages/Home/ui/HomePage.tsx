import { environment } from '@renderer/app/config/environments'
import { IHttpClient } from '@renderer/shared/api/HttpClient/interfaces'
import { WebviewTag } from 'electron'
import { useInjection } from 'inversify-react'
import { FC, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const HomePage: FC = () => {
  const webRef = useRef<WebviewTag>(null)
  const { getAuth } = useInjection(IHttpClient.$)
  const [searchParams] = useSearchParams()
  const route = searchParams.get('route')

  useEffect(() => {
    const webview = webRef.current
    if (!webview) return

    // Обработчик события загрузки страницы
    webview.addEventListener('dom-ready', () => {
      // Открываем DevTools для отладки (опционально)
      environment.dev && webview.openDevTools()

      const authData = getAuth()
      if (!authData) return
      const { token, type } = authData

      // Выполняем скрипт в контексте страницы
      webview.executeJavaScript(`
        window.localStorage.setItem('access_token', '${token}')
        window.localStorage.setItem('access_token_type', '${type}')
      `)
    })

    // Если есть параметр route, переходим на указанную страницу
    if (route) {
      const baseUrl = environment.websiteLink
      const fullUrl = `${baseUrl}${route}`

      webview.loadURL(fullUrl)
    }
  }, [route])

  return (
    <webview
      id="foo"
      src={environment.websiteLink}
      style={{ width: '100%', height: '100%', background: 'white' }}
      ref={webRef}
    ></webview>
  )
}

export default HomePage
