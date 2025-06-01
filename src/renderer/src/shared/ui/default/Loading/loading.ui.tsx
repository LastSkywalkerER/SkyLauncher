import cx from 'classnames'
import { FC } from 'react'

import { LoadingProps } from './loading.types'

export const Loading: FC<LoadingProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  // All pixel positions in the ring in order
  const ringPixels = [
    // Top part (left to right)
    { x: 16, y: 8, index: 0 },
    { x: 20, y: 8, index: 1 },
    { x: 24, y: 8, index: 2 },
    { x: 28, y: 8, index: 3 },

    // Top right part (top to bottom)
    { x: 32, y: 12, index: 4 },
    { x: 36, y: 16, index: 5 },
    { x: 36, y: 20, index: 6 },
    { x: 36, y: 24, index: 7 },

    // Bottom right part (top to bottom)
    { x: 36, y: 28, index: 8 },
    { x: 32, y: 32, index: 9 },

    // Bottom part (right to left)
    { x: 28, y: 36, index: 10 },
    { x: 24, y: 36, index: 11 },
    { x: 20, y: 36, index: 12 },
    { x: 16, y: 36, index: 13 },

    // Bottom left part (bottom to top)
    { x: 12, y: 32, index: 14 },
    { x: 8, y: 28, index: 15 },
    { x: 8, y: 24, index: 16 },
    { x: 8, y: 20, index: 17 },

    // Top left part (bottom to top)
    { x: 8, y: 16, index: 18 },
    { x: 12, y: 12, index: 19 }
  ]

  const totalPixels = ringPixels.length

  return (
    <div className={cx('inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <style>
          {`
            @keyframes pixelGap {
              0% { opacity: 1; }
              25% { opacity: 1; }
              30% { opacity: 0; }
              70% { opacity: 0; }
              75% { opacity: 1; }
              100% { opacity: 1; }
            }
          `}
        </style>
        {ringPixels.map((pixel) => {
          // Calculate animation delay for each pixel
          const animationDelay = (pixel.index / totalPixels) * 1.5 // 1.5s total duration

          return (
            <rect
              key={pixel.index}
              x={pixel.x}
              y={pixel.y}
              width="4"
              height="4"
              className="fill-primary-base"
              style={{
                animation: `pixelGap 1.5s infinite ease-in-out`,
                animationDelay: `${animationDelay}s`
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}

export const PageLoading: FC<LoadingProps> = (props) => {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <Loading {...props} />
    </div>
  )
}

export const LoadingOverlay: FC = () => {
  return (
    <div className="absolute z-100 top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-common-dark/50">
      <Loading className="w-10 h-10" />
    </div>
  )
}
