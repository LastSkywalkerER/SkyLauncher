import cx from 'classnames'
import { Button, ButtonProps } from 'primereact/button'
import { FC } from 'react'

import { Loading } from '../Loading'

export const BigButton: FC<ButtonProps> = ({ className, loading, disabled, ...props }) => {
  return (
    <Button
      {...props}
      className={cx('bg-transparent p-[5px] pb-2 relative group w-min h-min', className)}
      text
      disabled={loading || disabled}
    >
      <div className="relative w-full h-full shadow-2xl">
        <div
          className={cx(
            'absolute w-full h-full -translate-x-[5px] border-solid border-2 border-black shadow-down transition-colors',
            {
              'bg-primary-darker': loading || disabled,
              'bg-primary-dark group-hover:bg-primary-base': !(loading || disabled)
            }
          )}
        ></div>
        <div
          className={cx(
            'absolute w-full h-full translate-x-[5px] border-solid border-2 border-black shadow-down transition-colors',
            {
              'bg-primary-darker': loading || disabled,
              'bg-primary-dark group-hover:bg-primary-base': !(loading || disabled)
            }
          )}
        ></div>
        <div
          className={cx(
            'absolute w-full h-full -translate-y-[5px] border-solid border-2 border-black shadow-down transition-colors',
            {
              'bg-primary-dark': loading || disabled,
              'bg-primary-light group-hover:bg-primary-lighter': !(loading || disabled)
            }
          )}
        ></div>
        <div
          className={cx(
            'absolute w-full h-full translate-y-[5px] border-solid border-2 border-black shadow-down transition-colors',
            {
              'bg-primary-darker': loading || disabled,
              'bg-primary-darker group-hover:bg-primary-dark': !(loading || disabled)
            }
          )}
        ></div>
        <div
          className={cx('relative px-10 py-2 transition-colors', {
            'bg-primary-dark': loading || disabled,
            'bg-primary-base group-hover:bg-primary-light': !(loading || disabled)
          })}
        >
          <span
            className={cx(
              'font-minecraft text-lg tracking-wider text-shadow-down inline-block transform group-hover:scale-105 transition-transform duration-200',
              {
                'text-gray-400': loading || disabled,
                'text-main': !(loading || disabled)
              }
            )}
          >
            {props.children}
          </span>
          {loading && (
            <div className={'absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2'}>
              <Loading className={'w-[30px] h-[30px]'} />
            </div>
          )}
        </div>
      </div>
    </Button>
  )
}
