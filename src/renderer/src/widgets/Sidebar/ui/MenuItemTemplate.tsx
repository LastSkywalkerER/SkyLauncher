import cx from 'classnames'
import { FC, ReactNode } from 'react'

interface MenuItemTemplateProps {
  title: string
  subtitle: string
  className?: string
  icon?: string | ReactNode
}

export const MenuItemTemplate: FC<MenuItemTemplateProps> = ({
  title,
  subtitle,
  className,
  icon
}) => {
  return (
    <div
      className={cx(
        'flex items-center gap-2 py-3 px-2 cube-border hover:bg-white/10 focus:active-cube-border active:active-cube-border cursor-pointer',
        className
      )}
    >
      {icon && (
        <div className="w-[30px] h-[30px] flex items-center justify-center">
          {typeof icon === 'string' ? <i className={cx(icon, 'text-2xl')} /> : icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm text-main leading-3">{title}</span>
        <span className="text-sm font-bold text-main">{subtitle}</span>
      </div>
    </div>
  )
}
