import { FSInputPicker } from '@renderer/features'
import {
  FCDropdownFieldControlled,
  FCFieldButton,
  FCInputField,
  FCInputFieldControlled,
  FCMainButton
} from '@renderer/shared/ui'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { SkinUploadFormData, SkinUploadFormProps } from './skin-upload.types'
import { validationRules } from './skin-upload.validation'

const SkinUploadForm: FC<SkinUploadFormProps> = ({ onSubmit, uploading = false }) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<SkinUploadFormData>({
    defaultValues: {
      variant: 'classic',
      filePath: '',
      url: ''
    }
  })

  const watchedValues = watch()
  const canSubmit = watchedValues.filePath.trim() || watchedValues.url.trim()

  const skinVariants = [
    { label: t('skins.classic'), value: 'classic' as const },
    { label: t('skins.slim'), value: 'slim' as const }
  ]

  const handleFormSubmit = (data: SkinUploadFormData): void => {
    const hasFile = data.filePath.trim()
    const hasUrl = data.url.trim()

    if (!hasFile && !hasUrl) {
      return
    }

    onSubmit(data)
    reset()
  }

  return (
    <>
      <h2 className="text-lg font-bold mb-4 text-main uppercase">{t('skins.uploadNewSkin')}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Skin variant selection */}
        <div className="flex flex-col gap-2">
          <FCDropdownFieldControlled
            name="variant"
            control={control}
            label={t('skins.skinType')}
            options={skinVariants}
            placeholder={t('skins.selectSkinType')}
            className="w-full"
          />
          <small className="text-contrast-base text-xs">{t('skins.classicDescription')}</small>
        </div>

        {/* File upload */}
        <div className="flex flex-col gap-2">
          <FSInputPicker
            control={control}
            name="filePath"
            label={t('skins.uploadFromFile')}
            title={t('skins.selectPngFile')}
            properties={['openFile']}
            filters={[
              { name: 'PNG Images', extensions: ['png'] },
              { name: 'All Files', extensions: ['*'] }
            ]}
            placeholder={t('skins.fileNotSelected')}
            disabled={uploading}
            error={errors.filePath?.message}
            className="w-full"
            CustomButton={FCFieldButton}
            CustomInput={FCInputField}
          />
          <small className="text-contrast-base text-xs">{t('skins.fileDescription')}</small>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-contrast-base" />
          <span className="text-contrast-base text-sm">{t('skins.or')}</span>
          <hr className="flex-1 border-contrast-base" />
        </div>

        {/* URL upload */}
        <div className="flex flex-col gap-2">
          <FCInputFieldControlled
            name="url"
            control={control}
            label={t('skins.uploadFromUrl')}
            placeholder={t('skins.urlPlaceholder')}
            className="w-full"
            disabled={uploading}
            rules={validationRules.url}
            error={errors.url?.message}
          />
          <small className="text-contrast-base text-xs">{t('skins.urlDescription')}</small>
        </div>

        {/* Upload button */}
        <div className="flex justify-end pt-2">
          <FCMainButton
            type="submit"
            label={t('skins.uploadSkin')}
            icon="pi pi-upload"
            loading={uploading}
            disabled={uploading || !canSubmit}
            className="w-auto"
          />
        </div>
      </form>
    </>
  )
}

export { SkinUploadForm }
export type { SkinUploadFormData }
