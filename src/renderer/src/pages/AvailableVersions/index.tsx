import { ILauncherControlService } from '@renderer/features/LaucnherControls'
import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { ListBox } from 'primereact/listbox'
import { FC, JSX } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { IMCLocalGameVersion, IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { Loading } from '../../shared/ui/default/Loading'

interface FormValue {
  value: IMCLocalGameVersion
}

const AvailableVersions: FC = () => {
  const { handleSubmit, control } = useForm<FormValue>()
  const { value } = useWatch({ control })
  const { getCustomMCVersions, updateGame } = useInjection(IVersions.$)
  const versions = useObservable(getCustomMCVersions(), [])
  const { installGame } = useInjection(ILauncherControlService.$)
  const { execute: executeInstallGame, isLoading: isLoadingInstall } =
    useObservableRequest(installGame)
  const { execute: executeUpdateGame, isLoading: isLoadingUpdate } =
    useObservableRequest(updateGame)

  const onSubmit = (data): void => {
    data.value.isInstalled ? executeUpdateGame(data.value) : executeInstallGame(data.value)
  }

  const VersionTemplate = (option: IMCLocalGameVersion): JSX.Element => {
    return (
      <div className={'flex justify-between'}>
        <div className="flex items-center">
          <img
            alt={option.name}
            src={option.icon}
            style={{ width: '50px', marginRight: '.5rem' }}
          />
          <div>{option.name}</div>
        </div>
        {option.isInstalled && <span>(installed)</span>}
      </div>
    )
  }

  return (
    <form
      className="card flex justify-between items-center flex-col h-full p-10"
      noValidate={true}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="value"
        render={({ field }) => (
          <ListBox
            {...field}
            options={versions}
            optionLabel="name"
            className={'w-full h-3/4'}
            itemTemplate={VersionTemplate}
            virtualScrollerOptions={{ itemSize: 75 }}
            listStyle={{ height: '100%' }}
          />
        )}
      />

      {isLoadingInstall || isLoadingUpdate ? (
        <Loading />
      ) : (
        value && (
          <Button className={'w-fit'} type={'submit'}>
            {value.isInstalled ? 'Update' : 'Install'}
          </Button>
        )
      )}
    </form>
  )
}

export default AvailableVersions
