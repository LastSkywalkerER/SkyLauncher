import { SimpleTitle } from '@renderer/shared/ui/Title'
import cx from 'classnames'
import { Card, CardProps } from 'primereact/card'
import { FC } from 'react'

export const AuthCard: FC<CardProps> = ({ className, ...props }) => {
  return (
    <Card
      pt={{
        title: { className: 'absolute -translate-y-1/2 top-5' },
        body: { className: 'w-full flex gap-4 items-center justify-center' },
        content: { className: 'w-full flex flex-col gap-4 items-center justify-center' }
      }}
      title={<SimpleTitle />}
      className={cx(
        'bg-[var(--surface-a)] pt-20 px-14 pb-5 shadow-md relative min-w-[500px]',
        className
      )}
      {...props}
    />
  )
}
