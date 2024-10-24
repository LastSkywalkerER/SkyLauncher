import { ISettings } from '@renderer/entities/Settings/interfaces'
import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { FC, useEffect } from 'react'
import { FieldPath, FieldPathValue, SubmitHandler, useForm } from 'react-hook-form'
import { LauncherSettings } from '../../entities/Settings/interfaces'

import { settingsList } from '../../shared/config/settings.config'
import { InputFieldControlled } from '../../widgets/InputField'

const Settings: FC = () => {
  const { setSettings, getSettings } = useInjection(ISettings.$)

  const {
    control,

    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LauncherSettings>()

  useEffect(() => {
    getSettings().subscribe((data) => {
      data &&
        Object.entries(data).map(([key, value]) =>
          setValue(
            key as FieldPath<LauncherSettings>,
            value as FieldPathValue<LauncherSettings, never>
          )
        )
    })
  }, [])

  const onSubmit: SubmitHandler<LauncherSettings> = (data) => setSettings(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'p-1 h-full flex flex-col justify-between'}>
      <div className="flex gap-x-5 gap-y-10 flex-wrap p-10 bg-amber-950 bg-opacity-90 rounded-2xl">
        {settingsList.map(({ fieldName }) => (
          <InputFieldControlled
            key={fieldName}
            control={control}
            name={fieldName}
            error={errors[fieldName] ? 'Field is required' : undefined}
          />
        ))}
      </div>

      <Button type="submit" className={'self-center'}>
        Safe
      </Button>
    </form>
  )
}

export default Settings
