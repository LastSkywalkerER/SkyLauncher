import cx from 'classnames'
import { FC } from 'react'

import { TrashIconProps } from './trash-icon.types'

export const TrashIcon: FC<TrashIconProps> = ({ className, size = 'full' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    full: 'w-full h-full'
  }

  return (
    <div className={cx('inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg viewBox="0 0 64 64" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        {/* Крышка корзины */}
        <rect x="12" y="16" width="40" height="4" fill="#cc0000" />
        <rect x="16" y="12" width="32" height="4" fill="#cc0000" />

        {/* Ручка корзины */}
        <rect x="24" y="8" width="16" height="4" fill="#990000" />
        <rect x="24" y="8" width="4" height="8" fill="#990000" />
        <rect x="36" y="8" width="4" height="8" fill="#990000" />

        {/* Основание корзины */}
        <rect x="16" y="20" width="32" height="36" fill="#dd0000" />

        {/* Дно корзины */}
        <rect x="16" y="52" width="32" height="4" fill="#cc0000" />

        {/* Вертикальные полосы */}
        <rect x="24" y="24" width="4" height="24" fill="#990000" />
        <rect x="32" y="24" width="4" height="24" fill="#990000" />
        <rect x="40" y="24" width="4" height="24" fill="#990000" />

        {/* Контур корзины */}
        <rect x="16" y="20" width="1" height="36" fill="#660000" />
        <rect x="47" y="20" width="1" height="36" fill="#660000" />
        <rect x="16" y="20" width="32" height="1" fill="#660000" />
        <rect x="16" y="55" width="32" height="1" fill="#660000" />

        {/* Контур крышки */}
        <rect x="12" y="16" width="1" height="4" fill="#660000" />
        <rect x="51" y="16" width="1" height="4" fill="#660000" />
        <rect x="12" y="16" width="40" height="1" fill="#660000" />
        <rect x="12" y="19" width="40" height="1" fill="#660000" />

        {/* Контур ручки */}
        <rect x="24" y="8" width="1" height="8" fill="#660000" />
        <rect x="39" y="8" width="1" height="8" fill="#660000" />
        <rect x="24" y="8" width="16" height="1" fill="#660000" />
        <rect x="24" y="11" width="16" height="1" fill="#660000" />

        {/* Пиксельные детали */}
        <rect x="20" y="28" width="4" height="4" fill="#990000" />
        <rect x="20" y="36" width="4" height="4" fill="#990000" />
        <rect x="20" y="44" width="4" height="4" fill="#990000" />

        {/* Наклонные линии для пиксельного эффекта */}
        <polygon points="28,24 32,24 32,28 28,28" fill="#aa0000" />
        <polygon points="36,32 40,32 40,36 36,36" fill="#aa0000" />
        <polygon points="28,40 32,40 32,44 28,44" fill="#aa0000" />
      </svg>
    </div>
  )
}
