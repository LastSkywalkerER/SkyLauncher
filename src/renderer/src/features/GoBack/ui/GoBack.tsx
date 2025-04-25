import cx from 'classnames'
import { Button } from 'primereact/button'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface GoBackProps extends Omit<ButtonProps, 'onClick'> {
  className?: string
}

export const GoBack: FC<GoBackProps> = ({ className, ...props }) => {
  const { t } = useTranslation()

  return (
    <Link to="..">
      <Button
        type="button"
        icon="pi pi-arrow-left"
        label={t('common.goBack')}
        text
        className={cx('text-main', className)}
        {...props}
      />
    </Link>
  )
}
