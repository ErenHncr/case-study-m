import type React from "react"
import { Dropdown } from "antd"
import { MoonOutlined, SunOutlined } from "@ant-design/icons"

import { useAppDispatch, useAppSelector } from "../app/hooks"
import { changeTheme, selectTheme, Theme } from "../features/theme/themeSlice"

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
}

function ThemeSwitch() {
  const dispatch = useAppDispatch()
  const appTheme = useAppSelector(selectTheme)

  return (
    <Dropdown
      trigger={["click"]}
      placement="topLeft"
      menu={{
        selectedKeys: [appTheme],
        items: [
          {
            key: Theme.LIGHT,
            label: (
              <div style={dropdownItemStyle}>
                <SunOutlined />
                <span>Varsayılan Tema</span>
              </div>
            ),
          },
          {
            key: Theme.DARK,
            label: (
              <div style={dropdownItemStyle}>
                <MoonOutlined />
                <span>Koyu Tema</span>
              </div>
            ),
          },
        ],
        onClick: e => {
          dispatch(changeTheme(e.key as Theme))
        },
      }}
    >
      Temayı Değiştir
    </Dropdown>
  )
}

export default ThemeSwitch
