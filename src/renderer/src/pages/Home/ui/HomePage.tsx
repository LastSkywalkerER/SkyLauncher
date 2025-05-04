import { environment } from '@renderer/app/config/environments'
import { IHttpClient } from '@renderer/shared/api/HttpClient/interfaces'
import { WebviewTag } from 'electron'
import { useInjection } from 'inversify-react'
import { FC, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const HomePage: FC = () => {
  const webRef = useRef<WebviewTag>(null)
  const { getAuth } = useInjection(IHttpClient.$)
  const [searchParams] = useSearchParams()
  const route = searchParams.get('route')
  const [isDomReady, setIsDomReady] = useState(false)

  const checkAndNavigate = (webview: WebviewTag): void => {
    if (!route) return

    const baseUrl = environment.websiteLink
    const fullUrl = `${baseUrl}${route}`
    const currentUrl = webview.getURL()

    if (currentUrl !== fullUrl) {
      webview.loadURL(fullUrl)
    }
  }

  useEffect(() => {
    const webview = webRef.current
    if (!webview) return

    // Page load event handler
    webview.addEventListener('dom-ready', () => {
      const authData = getAuth()
      if (!authData) return
      const { token, type } = authData

      // Execute script in page context before loading main JS
      webview.executeJavaScript(`
        window.localStorage.setItem('access_token', '${token}')
        window.localStorage.setItem('access_token_type', '${type}')
      `)

      // Open DevTools for debugging (optional)
      // environment.dev && webview.openDevTools()

      setIsDomReady(true)
      checkAndNavigate(webview)
    })

    if (isDomReady) {
      checkAndNavigate(webview)
    }
  }, [route, isDomReady])

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
