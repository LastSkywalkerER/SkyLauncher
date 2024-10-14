import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { ListBox } from 'primereact/listbox'
import { useForm } from 'react-hook-form'
import { MCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.entity'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'

interface FormValue {
  value: MCGameVersion
}

const AvailableVersions = () => {
  // const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const { register, handleSubmit } = useForm<FormValue>()
  const { getCustomMCVersions, installGame } = useInjection(IVersions.$)
  const versions = useObservable(getCustomMCVersions(), [])

  const onSubmit = (data) => installGame(data.value)

  return (
    <form
      className="card flex justify-between flex-col h-full"
      noValidate={true}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ListBox
        {...register('value')}
        options={versions}
        optionLabel="name"
        className="w-full md:w-14rem"
      />
      <Button type={'submit'}>Install</Button>
    </form>
  )
}

export default AvailableVersions
