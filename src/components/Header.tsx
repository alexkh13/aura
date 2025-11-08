import { Link, useRouter } from '@tanstack/react-router'
import { Bell, User, Settings, MoreVertical } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useHeaderConfig, type PageAction } from '@/hooks/useHeaderConfig'
import { useState } from 'react'

function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-1.5 0-2 1-2 2v1c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V4c0-1-0.5-2-2-2z" />
      <path d="M12 6L5 20c-0.5 1 0 2 1 2h12c1 0 1.5-1 1-2L12 6z M12 14l-3 5h6l-3-5z" fillRule="evenodd" />
    </svg>
  )
}

function LogoWithBack({ title, backTo }: { title?: string, backTo?: string }) {
  const router = useRouter()

  const handleBack = () => {
    if (backTo) {
      router.navigate({ to: backTo as any })
    } else {
      router.history.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 group"
    >
      <div className="flex items-center">
        {/* White chevron - separated to the left */}
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </svg>

        {/* Logo icon */}
        <div className="text-blue-500 dark:text-blue-400">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            {/* Hanger top (hook) */}
            <path d="M12 2c-1.5 0-2 1-2 2v1c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V4c0-1-0.5-2-2-2z" />
            {/* Shark fin shaped hanger body with cutout */}
            <path d="M12 6L5 20c-0.5 1 0 2 1 2h12c1 0 1.5-1 1-2L12 6z M12 14l-3 5h6l-3-5z" fillRule="evenodd" />
          </svg>
        </div>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title || 'Back'}
      </span>
    </button>
  )
}

function ActionMenu({ pageActions }: { pageActions?: PageAction[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const hasPageActions = pageActions && pageActions.length > 0

  const handleActionClick = (action: PageAction) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.href) {
      router.navigate({ to: action.href as any })
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Menu Button - Always show as unified menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Menu Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <div className="fixed top-16 right-4 z-50 w-64 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="py-2">
                {/* Page Actions - if present */}
                {hasPageActions && (
                  <>
                    {pageActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            action.variant === 'destructive'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{action.label}</span>
                        </button>
                      )
                    })}

                    {/* Divider between page actions and global actions */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    {/* Global Actions Section Header */}
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        More
                      </p>
                    </div>
                  </>
                )}

                {/* Global Actions - always shown */}
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default function Header() {
  const { activeProfile } = useProfile()
  const { config } = useHeaderConfig()

  const { showBack = false, backTo, title, pageActions, customRight } = config

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {showBack ? (
              <LogoWithBack title={title} backTo={backTo} />
            ) : (
              <Link to="/" className="flex items-center gap-2">
                <div className="text-blue-500 dark:text-blue-400">
                  <LogoIcon />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {title || (
                    <>
                      Aura<span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">Wardrobe</span>
                    </>
                  )}
                </span>
              </Link>
            )}

            {/* Active Profile Indicator - only show on home */}
            {!showBack && !title && activeProfile && (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {activeProfile.avatar && (
                  <span className="text-sm">{activeProfile.avatar}</span>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeProfile.name}
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {customRight || <ActionMenu pageActions={pageActions} />}
          </div>
        </div>
      </div>
    </header>
  )
}
