import React from "react"
import { useNavigate } from "react-router"
import { message, Modal } from "antd"

import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks"
import {
  type Product,
  createProduct,
  resetProductCreate,
  selectProductCreate,
} from "./productsSlice"
import ProductCard from "./ProductCard"
import ProductForm from "./ProductForm"
import ProductBreadCrumb from "./ProductBreadCrumb"

const pageTitle = "Ürün Oluştur"
const pageDescription = "Ürün bilgilerini giriniz"

function ProductCreate() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const productCreate = useAppSelector(selectProductCreate)
  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()

  const onSubmit = React.useCallback(
    (values: Omit<Product, "id">) => {
      modalApi.confirm({
        title: "Ürün Oluştur",
        content: "Ürün oluşturmak istediğinize emin misiniz?",
        okText: "Oluştur",
        cancelText: "İptal",
        onOk() {
          void dispatch(createProduct(values))
            .unwrap()
            .then(() => {
              messageApi.open({
                type: "success",
                content:
                  "Ürün başarıyla oluşturuldu. Ürün listesine yönlendiriliyorsunuz.",
                duration: 1.5,
                onClose: () => {
                  void navigate("/products")
                },
              })
            })
            .catch(() => {
              messageApi.open({
                type: "error",
                content:
                  "Ürün oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
              })
            })
        },
      })
    },
    [dispatch, messageApi, modalApi, navigate],
  )

  React.useEffect(() => {
    return () => {
      dispatch(resetProductCreate())
    }
  }, [dispatch])

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <ProductBreadCrumb title={pageTitle} />

      <ProductCard title={pageTitle} description={pageDescription}>
        <ProductForm
          disabled={productCreate.isSuccess}
          isLoading={productCreate.isLoading}
          submitText="Oluştur"
          onSubmit={onSubmit}
        />
      </ProductCard>
    </>
  )
}

export default ProductCreate
