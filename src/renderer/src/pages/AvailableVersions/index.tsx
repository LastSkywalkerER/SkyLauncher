import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { ListBox } from 'primereact/listbox'
import { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { MCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.entity'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'

interface FormValue {
  value: MCGameVersion
}

const AvailableVersions: FC = () => {
  const { handleSubmit, control } = useForm<FormValue>()
  const { getCustomMCVersions, installGame } = useInjection(IVersions.$)
  const versions = useObservable(getCustomMCVersions(), [])

  const onSubmit = (data) => installGame(data.value)

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
          <ListBox {...field} options={versions} optionLabel="name" className={'w-fit'} />
        )}
      />

      <Button className={'w-fit'} type={'submit'}>
        Install
      </Button>
    </form>
  )
}

export default AvailableVersions
