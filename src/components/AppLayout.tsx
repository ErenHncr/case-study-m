import React from "react"
import { ProductOutlined, TeamOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Layout, Menu, theme } from "antd"
import { NavLink, Outlet, useMatch } from "react-router"
import ThemeSwitch from "./ThemeSwitch"

const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>["items"][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem(<NavLink to="/products">Ürünler</NavLink>, "1", <ProductOutlined />),
  getItem(<NavLink to="/users">Kullanıcılar</NavLink>, "2", <TeamOutlined />),
]

const siderStyle: React.CSSProperties = {
  /* overflow: "auto", */
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  padding: "8px 4px",
}

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const usersMatch = useMatch("/users")
  const productsMatch = useMatch("/products")

  const defaultSelectedKeys = React.useMemo(() => {
    if (usersMatch) {
      return ["2"]
    }
    if (productsMatch) {
      return ["1"]
    }
    return ["1"]
  }, [usersMatch, productsMatch])

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ ...siderStyle, background: colorBgContainer }}>
        <Menu
          defaultSelectedKeys={defaultSelectedKeys}
          mode="inline"
          items={items}
          style={{ borderInlineEnd: "unset" }}
        />
        <div
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            padding: "0 8px 16px 8px",
          }}
        >
          <ThemeSwitch />
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
