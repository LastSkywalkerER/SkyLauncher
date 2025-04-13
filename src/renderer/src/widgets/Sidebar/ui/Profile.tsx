import { UserData } from '@renderer/entities/User/interfaces'
import { IUser } from '@renderer/entities/User/interfaces'
import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import { LoadingOverlay } from '@renderer/shared/ui/Loading'
import { Avatar } from 'primereact/avatar'
import { FC } from 'react'

export const Profile: FC = () => {
  const { data, isLoading, isLoaded } = useLoadableState<IUser, UserData>(IUser.$)

  if (!isLoaded || isLoading) {
    return <LoadingOverlay />
  }

  return (
    <div className="flex items-center gap-3 p-3 border-b border-gray-700">
      <Avatar
        image="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        size="large"
        shape="circle"
      />
      <div>
        <div className="font-semibold text-white">{data?.email}</div>
        <div className="text-sm text-gray-400">{data?.role}</div>
      </div>
    </div>
  )
}
