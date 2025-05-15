import type React from "react"
import { ConfigProvider, theme } from "antd"
import { useAppSelector } from "../app/hooks"
import { selectTheme, Theme } from "../features/theme/themeSlice"

function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const appTheme = useAppSelector(selectTheme)

  return (
    <ConfigProvider
      theme={{
        algorithm:
          appTheme === Theme.LIGHT
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AppConfigProvider
