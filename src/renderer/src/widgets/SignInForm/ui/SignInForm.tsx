import { environment } from '@renderer/app/config/environments'
import { BigButton } from '@renderer/shared/ui/BigButton'
import { ExternalLink } from '@renderer/shared/ui/ExternalLink'
import { SimpleTitle } from '@renderer/shared/ui/Title'
import { Card } from 'primereact/card'
import { FC } from 'react'

export const SignInForm: FC = () => {
  return (
    <Card
      pt={{
        title: { className: 'absolute -translate-y-1/2 top-5' },
        body: { className: 'flex gap-4 items-center justify-center' },
        content: { className: 'flex flex-col gap-4 items-center justify-center' }
      }}
      title={<SimpleTitle />}
      className="bg-[var(--surface-a)] pt-20 px-14 pb-5 shadow-md relative"
    >
      <BigButton>Sign in with FreshCraft</BigButton>
      <ExternalLink to={`${environment.websiteLink}/auth`}>Sign Up</ExternalLink>
    </Card>
  )
}
