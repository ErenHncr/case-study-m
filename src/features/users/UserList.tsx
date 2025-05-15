import React from "react"
import {
  Breadcrumb,
  Button,
  Col,
  message,
  Row,
  Table,
  type TableColumnsType,
  theme,
} from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"

import { getUsers, selectUsers, type User } from "./usersSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

type UserListDataType = User

const columns: TableColumnsType<UserListDataType> = [
  { title: "İsim", dataIndex: "name" },
  { title: "E-posta", dataIndex: "email" },
  {
    title: "",
    width: 180,
    render: () => {
      return (
        <Row gutter={[6, 0]} justify="end">
          <Col>
            <Button
              color="primary"
              variant="text"
              icon={<EditOutlined />}
              style={{ padding: "0 6px" }}
            >
              Düzenle
            </Button>
          </Col>
          <Col>
            <Button
              color="danger"
              variant="text"
              icon={<DeleteOutlined />}
              style={{ padding: "0 6px" }}
            >
              Sil
            </Button>
          </Col>
        </Row>
      )
    },
  },
]

function UserList() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)

  React.useEffect(() => {
    void dispatch(getUsers())
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (users.isError) {
      messageApi.open({
        type: "error",
        content:
          "Kullanıcıları yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      })
    }
  }, [users.isError, messageApi])

  return (
    <>
      {contextHolder}
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: "Ürünler",
            href: "/products",
          },
        ]}
      ></Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table<UserListDataType>
          rowKey="id"
          loading={users.isLoading}
          columns={columns}
          dataSource={users.data}
          scroll={{ x: "auto" }}
        />
      </div>
    </>
  )
}

export default UserList
