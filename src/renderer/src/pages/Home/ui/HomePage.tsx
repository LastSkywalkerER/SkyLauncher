import { environment } from '@renderer/app/config/environments'
import { FC } from 'react'

const HomePage: FC = () => {
  return (
    <webview
      id="foo"
      src={environment.websiteLink}
      style={{ width: '100%', height: '100%' }}
    ></webview>
  )
}

export default HomePage
