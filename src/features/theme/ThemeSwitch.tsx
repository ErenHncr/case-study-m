import type React from "react"
import { Button, Dropdown } from "antd"
import { MoonOutlined, SunOutlined } from "@ant-design/icons"

import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks"
import { changeTheme, selectTheme, Theme } from "./themeSlice"

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
      <Button
        icon={appTheme === Theme.LIGHT ? <SunOutlined /> : <MoonOutlined />}
        style={{ width: "100%" }}
      >
        Temayı Değiştir
      </Button>
    </Dropdown>
  )
}

export default ThemeSwitch
