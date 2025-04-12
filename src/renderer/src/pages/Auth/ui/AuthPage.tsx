import { environment } from '@renderer/app/config/environments'
import { RouteNames } from '@renderer/app/routes/routeNames'
import { BigButton } from '@renderer/shared/ui/BigButton'
import { ExternalLink } from '@renderer/shared/ui/ExternalLink'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AuthCard } from './AuthCard'

const AuthPage: FC = () => {
  const { t } = useTranslation()

  return (
    <AuthCard>
      <Link to={RouteNames.Auth + RouteNames.Login}>
        <BigButton>{t('common.signIn')}</BigButton>
      </Link>
      <ExternalLink to={`${environment.websiteLink}/auth`}>{t('common.signUp')}</ExternalLink>
    </AuthCard>
  )
}

export default AuthPage
