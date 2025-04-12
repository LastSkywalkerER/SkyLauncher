import cx from 'classnames'
import { Button } from 'primereact/button'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface GoBackProps extends Omit<ButtonProps, 'onClick'> {
  className?: string
}

export const GoBack: FC<GoBackProps> = ({ className, ...props }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleGoBack = (): void => {
    navigate(-1)
  }

  return (
    <Button
      icon="pi pi-arrow-left"
      label={t('common.goBack')}
      onClick={handleGoBack}
      className={cx('text-main', className)}
      text
      {...props}
    />
  )
}
