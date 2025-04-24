import { UserData } from '@renderer/entities/User/interfaces'
import { IUser } from '@renderer/entities/User/interfaces'
import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { LoadingOverlay } from '@renderer/shared/ui/Loading'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useEffect, useRef, useState } from 'react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const Profile: FC = () => {
  const {
    data,
    isLoading,
    isLoaded,
    instance: { logout }
  } = useLoadableState<IUser, UserData>(IUser.$)
  const { execute: executeLogout } = useObservableRequest(logout)
  const menu = useRef<Menu>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  const items: MenuItem[] = [
    {
      label: t('common.manageProfile'),
      template: (item) => (
        <Link to={`/?route=/profile`} className="px-3 text-muted hover:text-primary-light">
          {item.label}
        </Link>
      )
    },
    {
      separator: true,
      className: 'mx-2 border-t-2 border-common-lighter mx-auto'
    },
    {
      label: t('common.logout'),
      template: (item) => (
        <div
          onClick={executeLogout}
          className="cursor-pointer flex items-center gap-2transition-colors duration-200 hover:bg-white/10 hover:text-primary-base px-3 py-1"
        >
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
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-common-light transition-colors relative group cube-border"
      onClick={handleClick}
    >
      <Menu
        model={items}
        popup
        ref={menu}
        className="border-2 border-white border-solid rounded-none font-bold text-muted"
      />
      <Avatar
        // image="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        label={data?.email?.slice(0, 1)}
        size="normal"
        shape="circle"
      />
      <div className="flex-1">
        <div className="font-semibold text-main">{data?.email}</div>
        <div className="text-sm text-muted">{data?.role}</div>
      </div>
      <i
        className={`pi ${isMenuOpen ? 'pi-chevron-up' : 'pi-chevron-down'} text-muted absolute right-1 top-3 -translate-y-1/2 transition-transform duration-200 group-hover:translate-y-[calc(50%-12px)]`}
      />
    </div>
  )
}
