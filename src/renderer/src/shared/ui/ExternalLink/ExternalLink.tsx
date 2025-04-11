import cx from 'classnames'
import { FC } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const ExternalLink: FC<LinkProps> = (props) => {
  return (
    <Link
      {...props}
      target={'_blank'}
      rel="noreferrer"
      className={cx(
        'underline cursor-pointer flex items-center gap-2 text-main transition-colors duration-200 hover:bg-white/20 rounded-lg px-2 py-1',
        props.className
      )}
    >
      {props.children}
      <i className="pi pi-external-link" />
    </Link>
  )
}
