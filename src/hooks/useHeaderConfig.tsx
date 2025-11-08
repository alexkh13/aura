import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface PageAction {
  icon: LucideIcon
  label: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'destructive'
}

export interface HeaderConfig {
  showBack?: boolean
  backTo?: string
  title?: string
  pageActions?: PageAction[]
  customRight?: ReactNode
}

interface HeaderConfigContextType {
  config: HeaderConfig
  setConfig: (config: HeaderConfig) => void
  resetConfig: () => void
}

const HeaderConfigContext = createContext<HeaderConfigContextType | undefined>(undefined)

export function HeaderConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<HeaderConfig>({})

  const setConfig = (newConfig: HeaderConfig) => {
    setConfigState(newConfig)
  }

  const resetConfig = () => {
    setConfigState({})
  }

  return (
    <HeaderConfigContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </HeaderConfigContext.Provider>
  )
}

export function useHeaderConfig() {
  const context = useContext(HeaderConfigContext)
  if (!context) {
    throw new Error('useHeaderConfig must be used within HeaderConfigProvider')
  }
  return context
}

// Hook for pages to configure their header
export function useSetHeader(config: HeaderConfig) {
  const { setConfig, resetConfig } = useHeaderConfig()

  useEffect(() => {
    setConfig(config)
    return () => {
      resetConfig()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.showBack,
    config.backTo,
    config.title,
    config.pageActions,
    config.customRight,
    setConfig,
    resetConfig,
  ])
}
