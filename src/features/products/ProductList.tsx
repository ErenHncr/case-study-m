import React from "react"
import { NavLink } from "react-router"
import {
  Breadcrumb,
  Button,
  Col,
  Empty,
  Flex,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  type TableColumnsType,
  theme,
} from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons"

import {
  deleteProduct,
  getProducts,
  resetProductDelete,
  selectProductDelete,
  selectProducts,
  setProductsFilter,
  type Product,
} from "./productsSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useProductCategoryOptions from "./hooks/useProductCategoryOptions"

type ProductListDataType = Product

function ProductList() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const productDelete = useAppSelector(selectProductDelete)

  const productCategoryOptions = useProductCategoryOptions()

  const toggleFavorite = React.useCallback(
    (product: Product) => {
      dispatch({
        type: "updateProduct/fulfilled",
        payload: {
          ...product,
          isFavorite: !product.isFavorite,
        },
      })
    },
    [dispatch],
  )

  const columns: TableColumnsType<ProductListDataType> = React.useMemo(
    () => [
      { title: "İsim", dataIndex: "name" },
      { title: "Fiyat (₺)", dataIndex: "price" },
      { title: "Kategori", dataIndex: "category" },
      { title: "Açıklama", dataIndex: "description" },
      {
        title: "",
        width: 200,
        render: (_, record) => {
          return (
            <Row gutter={[6, 0]} justify="end">
              <Col>
                <Button
                  color="cyan"
                  variant="text"
                  icon={record.isFavorite ? <StarFilled /> : <StarOutlined />}
                  title={
                    record.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"
                  }
                  onClick={() => {
                    toggleFavorite(record)
                  }}
                />
              </Col>
              <Col>
                <NavLink to={`/products/${String(record.id)}`}>
                  <Button
                    color="primary"
                    variant="text"
                    icon={<EyeOutlined />}
                    title="Görüntüle"
                  />
                </NavLink>
              </Col>
              <Col>
                <NavLink to={`/products/${String(record.id)}/edit`}>
                  <Button
                    color="primary"
                    variant="text"
                    icon={<EditOutlined />}
                    title="Düzenle"
                  />
                </NavLink>
              </Col>
              <Col>
                <Button
                  color="danger"
                  variant="text"
                  icon={<DeleteOutlined />}
                  title="Sil"
                  onClick={() => {
                    modalApi.confirm({
                      title: "Ürünü sil",
                      content: "Bu ürünü silmek istediğinize emin misiniz?",
                      okText: "Sil",
                      cancelText: "İptal",
                      onOk() {
                        void dispatch(deleteProduct(record.id))
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
    [dispatch, modalApi, toggleFavorite],
  )

  React.useEffect(() => {
    if (!products.isLoading && !products.isSuccess) {
      void dispatch(getProducts())
    }
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (products.isError) {
      messageApi.open({
        type: "error",
        content:
          "Ürünleri yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      })
    }
  }, [products.isError, messageApi])

  React.useEffect(() => {
    if (productDelete.isSuccess) {
      messageApi.open({
        type: "success",
        content: "Ürün başarıyla silindi.",
      })
    }
  }, [productDelete.isSuccess, messageApi])

  React.useEffect(() => {
    if (productDelete.isError) {
      messageApi.open({
        type: "error",
        content:
          "Ürün silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      })
    }
  }, [productDelete.isError, messageApi])

  React.useEffect(() => {
    return () => {
      dispatch(setProductsFilter({ query: "", category: "" }))
      dispatch(resetProductDelete())
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
            title: "Ürünler",
            href: "/products",
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
        <Flex gap={8} wrap="wrap" style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Ürün ara"
            allowClear
            onSearch={value => {
              dispatch(setProductsFilter({ query: value }))
            }}
            onClear={() => {
              dispatch(setProductsFilter({ query: "" }))
            }}
            style={{ width: "100%", maxWidth: "300px" }}
          />
          <Select
            showSearch
            allowClear
            placeholder="Kategori seçiniz"
            options={productCategoryOptions}
            style={{ width: "100%", maxWidth: "300px" }}
            notFoundContent="Kategori bulunamadı"
            onChange={(value: string) => {
              dispatch(setProductsFilter({ category: value }))
            }}
            onClear={() => {
              dispatch(setProductsFilter({ category: "" }))
            }}
          />
          <NavLink to="/products/add" style={{ marginLeft: "auto" }}>
            <Button variant="solid" color="primary" icon={<PlusOutlined />}>
              Ürün Ekle
            </Button>
          </NavLink>
        </Flex>
        <Table<ProductListDataType>
          rowKey="id"
          loading={products.isLoading || productDelete.isLoading}
          columns={columns}
          dataSource={products.filteredData}
          scroll={{ x: "auto" }}
          locale={{
            emptyText: <Empty description="Ürün bulunamadı" />,
          }}
        />
      </div>
    </>
  )
}

export default ProductList
