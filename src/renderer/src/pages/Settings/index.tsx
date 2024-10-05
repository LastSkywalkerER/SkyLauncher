import { CustomLauncherOptions, ISettings } from '@renderer/entities/Settings/interfaces'
import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const Settings: FC = () => {
  const { setSettings, getSettings } = useInjection(ISettings.$)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CustomLauncherOptions>({
    defaultValues: getSettings()
  })

  const onSubmit: SubmitHandler<CustomLauncherOptions> = (data) => setSettings(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* register your input into the hook by invoking the "register" function */}
      <InputText {...register('name', { required: true, minLength: 3 })} />
      {errors.name && <span>This field is required</span>}
      {/* include validation with required or other standard HTML validation rules */}
      <InputText {...register('maxRam', { required: true, valueAsNumber: true })} />
      {errors.maxRam && <span>This field is required</span>}
      <InputText {...register('minRam', { required: true, valueAsNumber: true })} />
      {/* errors will return when field validation fails  */}
      {errors.minRam && <span>This field is required</span>}

      <InputText
        {...register('ip', {
          required: false,
          pattern:
            /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
        })}
      />
      {errors.ip && <span>Wrong ip</span>}
      <InputText {...register('port', { required: false, valueAsNumber: true })} />
      {errors.port && <span>Must be number</span>}

      <Button type="submit">Safe</Button>
    </form>
  )
}

export default Settings
