import { ISettings } from '@renderer/entities/Settings/interfaces'
import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { FC, ReactElement, useEffect } from 'react'
import { FieldPath, FieldPathValue, SubmitHandler, useForm } from 'react-hook-form'

import { SettingField, settingsList } from '../../app/config/settings.config'
import { LauncherSettings } from '../../entities/Settings/interfaces'
import { OpenButton } from '../../features/index'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { InputFieldControlled, PageLoading } from '../../shared/ui'
import {
  CheckboxFieldControlled,
  DropdownFieldControlled,
  SliderInputFieldControlled
} from '../../shared/ui'

const Settings: FC = () => {
  const { setSettings, getSettings } = useInjection(ISettings.$)
  const { isLoading, isLoaded, execute: executeSetSettings } = useObservableRequest(setSettings)
  const {
    data: settingsData,
    isLoaded: isDataLoaded,
    isLoading: isDataLoading,
    execute: executeGetSettings
  } = useObservableRequest<[], LauncherSettings | null>(getSettings)
  const {
    control,

    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LauncherSettings>()

  useEffect(() => {
    executeGetSettings()
  }, [])

  useEffect(() => {
    settingsData &&
      Object.entries(settingsData).forEach(([key, value]) =>
        setValue(
          key as FieldPath<LauncherSettings>,
          value as FieldPathValue<LauncherSettings, never>
        )
      )
  }, [settingsData])

  const switchComponent = ({
    fieldName,
    type,
    options,
    label
  }: SettingField): ReactElement | null => {
    if (type === 'string') {
      return (
        <InputFieldControlled
          key={fieldName}
          control={control}
          name={fieldName}
          label={label}
          error={errors[fieldName] ? 'Field is required' : undefined}
        />
      )
    }

    if (type === 'filePath') {
      return (
        <div key={fieldName} className={'flex gap-5'}>
          <InputFieldControlled
            control={control}
            name={fieldName}
            label={label}
            error={errors[fieldName] ? 'Field is required' : undefined}
          />
          {settingsData && settingsData[fieldName] && (
            <OpenButton path={String(settingsData[fieldName])} />
          )}
        </div>
      )
    }

    if (type === 'options') {
      return (
        <DropdownFieldControlled
          control={control}
          key={fieldName}
          name={fieldName}
          options={options}
          label={label}
          error={errors[fieldName] ? 'Field is required' : undefined}
        />
      )
    }

    if (type === 'slider') {
      return (
        <SliderInputFieldControlled
          key={fieldName}
          name={fieldName}
          control={control}
          label={label}
          min={0}
          max={65536}
          step={512}
          error={errors[fieldName] ? 'Field is required' : undefined}
        />
      )
    }

    if (type === 'checkbox') {
      return (
        <CheckboxFieldControlled
          key={fieldName}
          name={fieldName}
          control={control}
          label={label}
          error={errors[fieldName] ? 'Field is required' : undefined}
        />
      )
    }

    return null
  }

  const onSubmit: SubmitHandler<LauncherSettings> = (data) => executeSetSettings(data)

  if (!isDataLoaded && isDataLoading) {
    return <PageLoading />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'p-1 h-full flex flex-col justify-between'}>
      {settingsData ? (
        <>
          <div className="flex gap-x-5 gap-y-10 flex-wrap p-10 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl">
            {settingsList.filter(({ isNotShow }) => !isNotShow).map(switchComponent)}
          </div>

          <Button
            type="submit"
            className={'self-center'}
            icon={isLoaded && 'pi pi-check'}
            loading={isLoading}
          >
            Safe
          </Button>
        </>
      ) : (
        'Cant load settigns'
      )}
    </form>
  )
}

export default Settings
