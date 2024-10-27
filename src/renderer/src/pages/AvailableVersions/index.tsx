import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { ListBox } from 'primereact/listbox'
import { FC, JSX } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { IMCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.interface'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { Loading } from '../../widgets/Loading'

interface FormValue {
  value: IMCGameVersion
}

const AvailableVersions: FC = () => {
  const { handleSubmit, control } = useForm<FormValue>()
  const { getCustomMCVersions, installGame } = useInjection(IVersions.$)
  const versions = useObservable(getCustomMCVersions(), [])
  const { execute: executeInstallGame, loading } = useObservableRequest(installGame)

  const onSubmit = (data): void => {
    executeInstallGame(data.value)
  }

  const Versionemplate = (option: IMCGameVersion): JSX.Element => {
    return (
      <div className="flex items-center">
        <img alt={option.name} src={option.icon} style={{ width: '50px', marginRight: '.5rem' }} />
        <div>{option.name}</div>
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
            className={'w-fit'}
            itemTemplate={Versionemplate}
          />
        )}
      />

      {loading ? (
        <Loading />
      ) : (
        <Button className={'w-fit'} type={'submit'}>
          Install
        </Button>
      )}
    </form>
  )
}

export default AvailableVersions
