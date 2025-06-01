import { FolderIcon } from '@renderer/shared/ui/default/FolderIcon'
import cx from 'classnames'
import { Button } from 'primereact/button'
import { FC, MouseEventHandler } from 'react'

import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { IFeatureService } from '../../service/index'
import { OpenFolderProps } from './interface'

export const OpenButton: FC<OpenFolderProps> = ({
  path,
  CutomButton = Button,
  className,
  ...props
}) => {
  const { openFolder } = useTransientInjection(IFeatureService.$)
  const { execute: executeOpenFolder } = useObservableRequest(openFolder)
  const handleOpenFolder: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()

    executeOpenFolder({ path })
  }

  return (
    <CutomButton
      rounded
      aria-label="Filter"
      onClick={handleOpenFolder}
      className={cx('p-0', className)}
      {...props}
    >
      <FolderIcon />
    </CutomButton>
  )
}
