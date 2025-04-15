import cx from 'classnames'
import { FC, ReactNode, SyntheticEvent } from 'react'

interface MenuItemTemplateProps {
  icon?: string | ReactNode
  label?: string
  title?: string
  subtitle?: string
  active?: boolean
  className?: string
  onClick?: (event: SyntheticEvent) => void
}

export const MenuItemTemplate: FC<MenuItemTemplateProps> = ({
  icon,
  label,
  title,
  subtitle,
  active,
  className,
  onClick
}) => {
  return (
    <div
      className={cx(
        'flex items-center gap-2 py-3 px-2 cube-border  focus:active-cube-border active:active-cube-border cursor-pointer',
        {
          ['active-cube-border hover:bg-transparent']: active,
          ['hover:bg-white/10']: !active
        },
        className
      )}
      onClick={onClick}
    >
      {icon && (
        <div className="w-[30px] h-[30px] flex items-center justify-center">
          {typeof icon === 'string' ? <i className={cx(icon, 'text-2xl')} /> : icon}
        </div>
      )}
      <div className="flex flex-col">
        {label && <span className="text-sm text-main leading-3">{label}</span>}
        {title && <span className="text-sm text-main leading-3">{title}</span>}
        {subtitle && <span className="text-sm font-bold text-main">{subtitle}</span>}
      </div>
    </div>
  )
}
