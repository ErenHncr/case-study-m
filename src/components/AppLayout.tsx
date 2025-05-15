import type React from "react"
import { ProductOutlined, TeamOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Layout, Menu, theme } from "antd"
import { NavLink, Outlet } from "react-router"
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
}

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ ...siderStyle, background: colorBgContainer }}>
        <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
        <div
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            padding: "0 12px 16px 12px",
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
