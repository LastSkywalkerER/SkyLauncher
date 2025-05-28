import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { PageLoading } from '@renderer/shared/ui'
import { MicrosoftMinecraftProfile } from '@xmcl/user'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ReactSkinview3d from 'react-skinview3d'
import { WalkingAnimation } from 'skinview3d'

import { ISkinService } from './skin.interface'
import { SkinUploadForm, SkinUploadFormData } from './skin-upload.form'

const SkinsPage: FC = () => {
  const { t } = useTranslation()
  const {
    data,
    isLoading,
    instance: { setSkin }
  } = useLoadableState<ISkinService, MicrosoftMinecraftProfile>(ISkinService.$)
  const { execute: executeSkinUpload, isLoading: isUploading } = useObservableRequest(setSkin)

  const handleSkinUpload = (formData: SkinUploadFormData): void => {
    const hasFile = formData.filePath.trim()
    const hasUrl = formData.url.trim()

    // Check that at least one field is filled
    if (!hasFile && !hasUrl) {
      return
    }

    // Determine source: file or URL
    const source = hasFile ? formData.filePath : formData.url.trim()

    // Use useObservableRequest to execute the request
    executeSkinUpload(source, formData.variant)
  }

  if (isLoading) {
    return <PageLoading />
  }

  if (!data) {
    return <div>{t('common.noData')}</div>
  }

  return (
    <div className="w-full h-full flex flex-row gap-4 p-4">
      {/* Current skins - left side */}
      <div className="w-full h-full overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-main uppercase">{t('skins.yourSkins')}</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {data.skins.map((skin, index) => (
            <div key={skin.id} className="flex flex-col items-center gap-2">
              <ReactSkinview3d
                skinUrl={skin.url}
                capeUrl={data.capes[index]?.url}
                height="300"
                width="300"
                options={{
                  animation: new WalkingAnimation()
                  // enableControls: false,
                }}
              />
              <div className="text-center text-sm">
                <div className="font-medium text-main">
                  {skin.variant === 'CLASSIC' ? 'Classic' : 'Slim'}
                </div>
                <div className="text-contrast-base">{skin.state}</div>
              </div>
            </div>
          ))}

          {data.skins.length === 0 && (
            <div className="w-full text-center text-contrast-base py-8">
              {t('skins.noSkinsYet')}
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="w-px h-full bg-contrast-base"></div>

      {/* Skin upload form - right side */}
      <div className="w-full h-full">
        <SkinUploadForm onSubmit={handleSkinUpload} uploading={isUploading} />
      </div>
    </div>
  )
}

export default SkinsPage
