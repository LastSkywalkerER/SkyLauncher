import cx from 'classnames'
import { FC } from 'react'

import { FolderIconProps } from './folder-icon.types'

export const FolderIcon: FC<FolderIconProps> = ({ className, size = 'full' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    full: 'w-full h-full'
  }

  return (
    <div className={cx('inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg viewBox="0 0 64 64" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        {/* Задняя часть папки */}
        <rect x="8" y="24" width="48" height="32" className="fill-primary-base" />
        <rect x="8" y="24" width="48" height="8" className="fill-primary-base opacity-80" />

        {/* Вкладка папки */}
        <rect x="8" y="16" width="24" height="8" className="fill-primary-base opacity-80" />
        <rect x="8" y="16" width="24" height="4" className="fill-primary-base opacity-60" />

        {/* Детали текстуры */}
        <rect x="12" y="28" width="4" height="4" className="fill-primary-base opacity-40" />
        <rect x="20" y="32" width="4" height="4" className="fill-primary-base opacity-40" />
        <rect x="36" y="36" width="4" height="4" className="fill-primary-base opacity-40" />
        <rect x="48" y="40" width="4" height="4" className="fill-primary-base opacity-40" />

        {/* Контур папки */}
        <rect x="8" y="24" width="1" height="32" className="fill-black" />
        <rect x="8" y="24" width="48" height="1" className="fill-black" />
        <rect x="55" y="24" width="1" height="32" className="fill-black" />
        <rect x="8" y="55" width="48" height="1" className="fill-black" />
        <rect x="8" y="16" width="1" height="8" className="fill-black" />
        <rect x="31" y="16" width="1" height="8" className="fill-black" />
        <rect x="8" y="16" width="24" height="1" className="fill-black" />
        <rect x="8" y="23" width="24" height="1" className="fill-black" />
      </svg>
    </div>
  )
}
