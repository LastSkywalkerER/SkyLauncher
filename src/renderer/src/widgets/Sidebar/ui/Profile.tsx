import { environment } from '@renderer/app/config/environments'
import { UserData } from '@renderer/entities/User/interfaces'
import { IUser } from '@renderer/entities/User/interfaces'
import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import { ExternalLink } from '@renderer/shared/ui/ExternalLink'
import { LoadingOverlay } from '@renderer/shared/ui/Loading'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useEffect, useRef, useState } from 'react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const Profile: FC = () => {
  const { data, isLoading, isLoaded } = useLoadableState<IUser, UserData>(IUser.$)
  const menu = useRef<Menu>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  const items: MenuItem[] = [
    {
      label: t('common.manageProfile'),
      template: (item) => (
        <ExternalLink withoutEffects to={`${environment.websiteLink}/profile`} className="px-3">
          {item.label}
        </ExternalLink>
      )
    },
    {
      label: t('common.logout'),
      template: (item) => (
        <div className="cursor-pointer flex items-center gap-2 text-main transition-colors duration-200 hover:bg-white/20 px-3 py-1">
          {item.label}
        </div>
      )
    }
  ]

  useEffect(() => {
    if (!containerRef.current || !menu.current) return

    const containerWidth = containerRef.current.offsetWidth
    const menuElement = menu.current.getElement()

    if (!menuElement) return

    // Set initial width
    menuElement.style.width = `${containerWidth}px`

    // Create a MutationObserver to watch for changes in the menu's visibility
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // When the menu's style changes (like when it loses focus), reapply the width
          if (menuElement.style.display !== 'none') {
            menuElement.style.width = `${containerWidth}px`
          }
        }
      })
    })

    // Start observing the menu element for style changes
    observer.observe(menuElement, { attributes: true })

    // Clean up the observer when the component unmounts
    return (): void => {
      observer.disconnect()
    }
  }, [isMenuOpen])

  if (!isLoaded || isLoading) {
    return <LoadingOverlay />
  }

  const handleClick = (e: React.MouseEvent): void => {
    menu.current?.toggle(e)
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-common-light transition-colors relative group border-t-2 border-r-4 border-b-2 border-l border-t-common-lighter border-r-common-darker border-b-common-darker border-l-common-lighter"
      onClick={handleClick}
    >
      <Menu model={items} popup ref={menu} />
      <Avatar
        // image="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        label={data?.email?.slice(0, 1)}
        size="normal"
        shape="circle"
      />
      <div className="flex-1">
        <div className="font-semibold text-white">{data?.email}</div>
        <div className="text-sm text-muted">{data?.role}</div>
      </div>
      <i
        className={`pi ${isMenuOpen ? 'pi-chevron-up' : 'pi-chevron-down'} text-muted absolute right-2 top-2 -translate-y-1/2 transition-transform duration-200 group-hover:translate-y-[calc(50%-12px)]`}
      />
    </div>
  )
}
