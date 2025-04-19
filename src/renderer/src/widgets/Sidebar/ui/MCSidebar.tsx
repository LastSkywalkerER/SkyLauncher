import { Menu } from 'primereact/menu'
import { FC } from 'react'

import { useMenuItems } from '../hooks/menu-items.hook'

export const MCSidebar: FC = () => {
  const { topMenuItems, scrollableMenuItems, bottomMenuItems } = useMenuItems()

  return (
    <div className="w-full h-full bg-common-base border-r-2 border-common-darker flex flex-col">
      {/* Fixed top section */}
      <Menu model={topMenuItems} className="w-full p-0 border-none" />

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto">
        <Menu model={scrollableMenuItems} className="w-full p-0 border-none" />
      </div>

      {/* Fixed bottom section */}
      <Menu model={bottomMenuItems} className="w-full p-0 border-none" />
    </div>
  )
}
