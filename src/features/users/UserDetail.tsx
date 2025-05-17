import React from "react"
import { useMatch, useNavigate, useParams } from "react-router"
import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Spin,
  theme,
  Typography,
} from "antd"

import { formValidateMessages } from "../../lib/antd"
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks"
import {
  getUser,
  resetUser,
  resetUserUpdate,
  selectUser,
  selectUserUpdate,
  updateUser,
} from "./usersSlice"

function UserDetail() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()
  const navigate = useNavigate()
  const isUserDetailEdit = useMatch("/users/:userId/edit")
  const { userId } = useParams()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const userUpdate = useAppSelector(selectUserUpdate)

  const onFinish = React.useCallback(
    (values: { name: string; email: string }) => {
      modalApi.confirm({
        title: "Kullanıcıyı güncelle",
        content: "Bu kullanıcıyı güncellemek istediğinize emin misiniz?",
        okText: "Güncelle",
        cancelText: "İptal",
        onOk() {
          dispatch(updateUser({ id: Number(userId), ...values }))
            .unwrap()
            .then(() => {
              messageApi.open({
                type: "success",
                content: "Kullanıcı başarıyla güncellendi.",
              })
            })
            .catch(() => {
              messageApi.open({
                type: "error",
                content:
                  "Kullanıcı güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
              })
            })
        },
      })
    },
    [dispatch, messageApi, modalApi, userId],
  )

  React.useEffect(() => {
    if (userId) {
      dispatch(getUser(userId))
        .unwrap()
        .catch(() => {
          messageApi.open({
            type: "error",
            content:
              "Kullanıcı yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
            onClose: () => {
              void navigate("/users")
            },
          })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    return () => {
      dispatch(resetUser())
      dispatch(resetUserUpdate())
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
          {
            title: isUserDetailEdit
              ? "Kullanıcıyı Düzenle"
              : "Kullanıcı Detayı",
          },
        ]}
      />
      <div
        style={{
          position: "relative",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 136,
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        {user.isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Spin />
          </div>
        )}
        {!user.isLoading && (
          <>
            <Typography.Title
              level={5}
              style={{ marginTop: 0, marginBottom: 16 }}
            >
              {isUserDetailEdit ? "Kullanıcıyı Düzenle" : "Kullanıcı Detayı"}
            </Typography.Title>
            <Form
              layout="vertical"
              validateMessages={formValidateMessages}
              onFinish={onFinish}
              initialValues={{
                name: user.data?.name,
                email: user.data?.email,
              }}
            >
              {isUserDetailEdit ? (
                <Form.Item
                  name={["name"]}
                  label="İsim"
                  rules={[{ required: true }, { min: 3, max: 60 }]}
                >
                  <Input disabled={userUpdate.isLoading} />
                </Form.Item>
              ) : (
                <Flex wrap="wrap" gap={6} style={{ marginBottom: 4 }}>
                  <Typography.Text strong style={{ width: "60px" }}>
                    İsim:{" "}
                  </Typography.Text>
                  <Typography.Text>{user.data?.name}</Typography.Text>
                </Flex>
              )}
              {isUserDetailEdit ? (
                <Form.Item
                  name={["email"]}
                  label="E-posta"
                  rules={[{ required: true }, { type: "email" }]}
                >
                  <Input type="email" disabled={userUpdate.isLoading} />
                </Form.Item>
              ) : (
                <Flex wrap="wrap" gap={6}>
                  <Typography.Text strong style={{ width: "60px" }}>
                    E-posta:{" "}
                  </Typography.Text>
                  <Typography.Text>{user.data?.email}</Typography.Text>
                </Flex>
              )}

              {isUserDetailEdit && (
                <Button
                  loading={userUpdate.isLoading}
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", marginTop: 8 }}
                >
                  Kaydet
                </Button>
              )}
            </Form>
          </>
        )}
      </div>
    </>
  )
}

export default UserDetail
