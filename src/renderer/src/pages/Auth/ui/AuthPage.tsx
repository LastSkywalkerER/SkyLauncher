import { SignInForm } from '@renderer/widgets/SignInForm/ui'
import { FC } from 'react'

const AuthPage: FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignInForm />
    </div>
  )
}

export default AuthPage
