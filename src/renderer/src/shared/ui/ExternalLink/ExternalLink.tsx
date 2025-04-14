import cx from 'classnames'
import { FC } from 'react'
import { Link, LinkProps } from 'react-router-dom'

interface ExternalLinkProps extends LinkProps {
  withoutEffects?: boolean
}

export const ExternalLink: FC<ExternalLinkProps> = ({ withoutEffects, ...props }) => {
  return (
    <Link
      {...props}
      target={'_blank'}
      rel="noreferrer"
      className={cx(
        ' cursor-pointer flex items-center gap-2 text-main transition-colors duration-200 hover:bg-white/20 px-2 py-1',
        { 'underline  rounded-lg': !withoutEffects },
        props.className
      )}
    >
      {props.children}
      <i className="pi pi-external-link" />
    </Link>
  )
}
