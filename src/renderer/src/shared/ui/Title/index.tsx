import cx from 'classnames'
import { FC, ImgHTMLAttributes } from 'react'

import simpleTitle from '../../../../../../resources/images/modpacks/minimalism logo.png'

export const SimpleTitle: FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <img
      {...props}
      src={simpleTitle}
      alt="simple title"
      className={cx('max-w-96', props.className)}
    />
  )
}
