import { OpenButton } from '@renderer/features'
import { RemoveButton } from '@renderer/features/RemoveFolder/ui'
import { FCDropdownFieldControlled, FCSliderInputFieldControlled } from '@renderer/shared/ui'
import { FCInputFieldControlled } from '@renderer/shared/ui'
import { FCMainButton, FCSecondaryButton } from '@renderer/shared/ui/freshcraft/Button/ui/button.ui'
import { FCFieldButton } from '@renderer/shared/ui/freshcraft/Button/ui/button.ui'
import { FCCheckboxFieldControlled } from '@renderer/shared/ui/freshcraft/Checkbox'
import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { defaultJavaArgs, defaultMaxMemory, javaVersionList } from '../../../../../shared/constants'
import { ModpackSettings } from '../interface'
import { SettingsFormProps } from '../interface'

export const SettingsForm: FC<SettingsFormProps> = ({
  defaultValues,
  onCancel,
  onSubmit: onSubmitProps
}) => {
  const { t } = useTranslation()
  const {
    setValue,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm<ModpackSettings>({ defaultValues })

  const folder = watch('folder')
  const javaArgsMaxMemory = watch('javaArgsMaxMemory')

  const resetJavaArgs = useCallback(() => {
    setValue('javaArgs', defaultJavaArgs)
    setValue('javaArgsMaxMemory', defaultMaxMemory)
  }, [setValue])

  useEffect(() => {
    const currentJavaArgs = getValues('javaArgs')
    const newXmxValue = `-Xmx${Math.round(javaArgsMaxMemory / 1024)}G`

    if (currentJavaArgs.includes('-Xmx')) {
      // Replace existing -Xmx value
      const updatedArgs = currentJavaArgs.replace(/-Xmx\d+(\.\d+)?G/, newXmxValue)
      setValue('javaArgs', updatedArgs)
    } else if (currentJavaArgs) {
      // Add -Xmx at the beginning if it doesn't exist
      setValue('javaArgs', `${newXmxValue} ${currentJavaArgs}`)
    } else {
      // Set only -Xmx if javaArgs is empty
      setValue('javaArgs', newXmxValue)
    }
  }, [javaArgsMaxMemory, getValues, setValue])

  const onSubmit = (data: ModpackSettings): void => {
    onSubmitProps(data)
  }

  return (
    <form
      className="flex flex-col items-center justify-between gap-4 w-full h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className={'flex items-center w-full'}>
          <FCInputFieldControlled
            className="w-full"
            control={control}
            name={'folder'}
            disabled
            label={t('settings.gameDirectory')}
            error={errors['folder'] ? t('errors.required') : undefined}
            afterInputComponent={
              <>
                <OpenButton
                  path={folder}
                  CutomButton={FCFieldButton}
                  className="text-primary-base"
                />
                <RemoveButton path={folder} CutomButton={FCFieldButton} className="rounded-r-md" />
              </>
            }
          />
        </div>
        <div className="flex flex-col justify-start gap-2 w-full">
          <span className="text-xs uppercase font-bold">{t('settings.resolution')}</span>
          <div className="flex gap-2 w-full">
            <FCInputFieldControlled
              control={control}
              name={'width'}
              withLabel={false}
              placeholder={t('settings.width')}
              className="w-full"
            />
            <span className="mt-1">x</span>
            <FCInputFieldControlled
              control={control}
              name={'height'}
              withLabel={false}
              placeholder={t('settings.height')}
              className="w-full"
            />
          </div>
        </div>
        <FCCheckboxFieldControlled
          key={'fullscreen'}
          name={'fullscreen'}
          control={control}
          label={t('settings.fullscreen')}
          error={errors['fullscreen'] ? t('errors.required') : undefined}
        />
        <FCDropdownFieldControlled
          control={control}
          key={'javaVersion'}
          name={'javaVersion'}
          options={javaVersionList.map((version) => String(version))}
          label={t('settings.javaVersion')}
          error={errors['javaVersion'] ? t('errors.required') : undefined}
        />
        {/* <FCInputFieldControlled
          placeholder="C:\\Program Files\\Java\\jdk-17"
          control={control}
          name={'javaPath'}
          label={t('settings.javaPath')}
          error={errors['javaPath'] ? t('errors.required') : undefined}
          inputClassName="h-[34px]"
          afterInputComponent={
            <OpenButton
              path={javaPath}
              CutomButton={FCFieldButton}
              className="rounded-r-md text-primary-base"
            />
          }
          className="w-full"
        /> */}
        <FCInputFieldControlled
          placeholder="Example: -Xmx12G"
          control={control}
          name={'javaArgs'}
          label={t('settings.javaArguments')}
          className="w-full"
          error={errors['javaArgs'] ? t('errors.required') : undefined}
          inputClassName="h-[34px]"
          afterInputComponent={
            <FCFieldButton
              className="h-full m-0 py-1 px-5 flex items-center justify-center text-main bg-common-darker rounded-l-none rounded-r-md hover:bg-common-base w-auto"
              text
              label={t('settings.reset')}
              onClick={resetJavaArgs}
              type="reset"
            />
          }
        />
        <div className="flex gap-4">
          {/* <FCSliderInputFieldControlled
            name={'javaArgsMinMemory'}
            control={control}
            label={t('settings.minJavaRAM')}
            min={0}
            max={65536}
            step={512}
            error={errors['javaArgsMinMemory'] ? t('errors.required') : undefined}
          /> */}
          <FCSliderInputFieldControlled
            name={'javaArgsMaxMemory'}
            control={control}
            label={t('settings.maxJavaRAM')}
            min={0}
            max={65536}
            step={512}
            error={errors['javaArgsMaxMemory'] ? t('errors.required') : undefined}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full justify-end">
        <FCSecondaryButton label={t('common.cancel')} onClick={onCancel} type="reset" />
        <FCMainButton label={t('common.save')} type="submit" />
      </div>
    </form>
  )
}
