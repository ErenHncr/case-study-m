import React from "react"
import { NavLink } from "react-router"
import {
  Breadcrumb,
  Button,
  Col,
  Empty,
  Input,
  message,
  Modal,
  Row,
  Table,
  type TableColumnsType,
  theme,
} from "antd"
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons"

import {
  deleteUser,
  getUsers,
  resetUserDelete,
  selectUserDelete,
  selectUsers,
  selectUsersFilterQuery,
  setUsersFilterQuery,
  type User,
} from "./usersSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

type UserListDataType = User

function UserList() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const usersFilterQuery = useAppSelector(selectUsersFilterQuery)
  const userDelete = useAppSelector(selectUserDelete)

  const columns: TableColumnsType<UserListDataType> = React.useMemo(
    () => [
      { title: "İsim", dataIndex: "name" },
      { title: "E-posta", dataIndex: "email" },
      {
        title: "",
        width: 140,
        render: (_, record) => {
          return (
            <Row gutter={[6, 0]} justify="end">
              <Col>
                <NavLink to={`/users/${String(record.id)}`}>
                  <Button
                    color="primary"
                    variant="text"
                    icon={<EyeOutlined />}
                    style={{ padding: "0 6px" }}
                    title="Görüntüle"
                  />
                </NavLink>
              </Col>
              <Col>
                <NavLink to={`/users/${String(record.id)}/edit`}>
                  <Button
                    color="primary"
                    variant="text"
                    icon={<EditOutlined />}
                    style={{ padding: "0 6px" }}
                    title="Düzenle"
                  />
                </NavLink>
              </Col>
              <Col>
                <Button
                  color="danger"
                  variant="text"
                  icon={<DeleteOutlined />}
                  style={{ padding: "0 6px" }}
                  title="Sil"
                  onClick={() => {
                    modalApi.confirm({
                      title: "Kullanıcıyı sil",
                      content:
                        "Bu kullanıcıyı silmek istediğinize emin misiniz?",
                      okText: "Sil",
                      cancelText: "İptal",
                      onOk() {
                        void dispatch(deleteUser(record.id))
                      },
                    })
                  }}
                />
              </Col>
            </Row>
          )
        },
      },
    ],
    [dispatch, modalApi],
  )

  React.useEffect(() => {
    if (!users.isLoading && !users.isSuccess) {
      void dispatch(getUsers())
    }
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

  React.useEffect(() => {
    if (userDelete.isSuccess) {
      messageApi.open({
        type: "success",
        content: "Kullanıcı başarıyla silindi.",
      })
    }
  }, [userDelete.isSuccess, messageApi])

  React.useEffect(() => {
    if (userDelete.isError) {
      messageApi.open({
        type: "error",
        content:
          "Kullanıcı silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      })
    }
  }, [userDelete.isError, messageApi])

  React.useEffect(() => {
    return () => {
      dispatch(setUsersFilterQuery(""))
      dispatch(resetUserDelete())
    }
  }, [dispatch])

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: "Kullanıcılar",
            href: "/users",
          },
        ]}
      />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Row>
          <Col span={24}>
            <Input.Search
              placeholder="Kullanıcı ara"
              allowClear
              defaultValue={usersFilterQuery}
              onSearch={value => {
                dispatch(setUsersFilterQuery(value))
              }}
              style={{ marginBottom: 16, width: "100%", maxWidth: 300 }}
            />
          </Col>
        </Row>
        <Table<UserListDataType>
          rowKey="id"
          loading={users.isLoading || userDelete.isLoading}
          columns={columns}
          dataSource={users.filteredData}
          scroll={{ x: "auto" }}
          locale={{
            emptyText: <Empty description="Kullanıcı bulunamadı" />,
          }}
        />
      </div>
    </>
  )
}

export default UserList
