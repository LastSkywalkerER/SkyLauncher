import cx from 'classnames'
import { Button, ButtonProps } from 'primereact/button'
import { FC } from 'react'

export const FCFieldButton: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      className={cx(
        'h-[34px] m-0 px-5 bg-common-darker rounded-none hover:bg-common-base w-auto',
        className
      )}
      text
      {...props}
    />
  )
}

export const FCMainButton: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      text
      className={cx(
        'text-main text-sm bg-primary-base hover:bg-primary-light px-4 py-2 h-min rounded-none',
        className
      )}
      {...props}
    />
  )
}

export const FCSecondaryButton: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      text
      severity="secondary"
      className={cx(
        'text-main text-sm bg-transparent hover:bg-primary-lighter px-4 py-2 h-min rounded-none border-contrast-base border border-solid',
        className
      )}
      {...props}
    />
  )
}
