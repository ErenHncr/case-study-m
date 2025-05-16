import React from "react"
import { useNavigate, useParams } from "react-router"
import { message, Modal } from "antd"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  type Product,
  getProduct,
  resetProduct,
  resetProductUpdate,
  selectProduct,
  selectProductUpdate,
  updateProduct,
} from "./productsSlice"
import ProductCard from "./ProductCard"
import ProductForm from "./ProductForm"
import ProductBreadCrumb from "./ProductBreadCrumb"

const pageTitle = "Ürünü Düzenle"
const pageDescription = "Ürün bilgilerini düzenleyebilirsiniz."

function ProductEdit() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const product = useAppSelector(selectProduct)
  const productUpdate = useAppSelector(selectProductUpdate)
  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()

  const onSubmit = React.useCallback(
    (values: Omit<Product, "id">) => {
      modalApi.confirm({
        title: "Ürünü güncelle",
        content: "Bu ürünü güncellemek istediğinize emin misiniz?",
        okText: "Güncelle",
        cancelText: "İptal",
        onOk() {
          void dispatch(updateProduct({ id: Number(productId), ...values }))
        },
      })
    },
    [dispatch, modalApi, productId],
  )

  React.useEffect(() => {
    if (productId) {
      void dispatch(getProduct(productId))
    }
  }, [productId, dispatch])

  React.useEffect(() => {
    if (productUpdate.isSuccess) {
      messageApi.open({
        type: "success",
        content: "Ürün başarıyla güncellendi.",
      })
    }
  }, [productUpdate.isSuccess, messageApi])

  React.useEffect(() => {
    if (productUpdate.isError) {
      messageApi.open({
        type: "error",
        content:
          "Ürün güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      })
    }
  }, [productUpdate.isError, messageApi])

  React.useEffect(() => {
    if (product.isError) {
      messageApi.open({
        type: "error",
        content:
          "Ürün yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        duration: 1.5,
        onClose: () => {
          void navigate("/products")
        },
      })
    }
  }, [product.isError, messageApi, navigate])

  React.useEffect(() => {
    return () => {
      dispatch(resetProduct())
      dispatch(resetProductUpdate())
    }
  }, [dispatch])

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <ProductBreadCrumb title={pageTitle} />
      {!product.isError && (
        <ProductCard
          isLoading={product.isLoading}
          title={pageTitle}
          description={pageDescription}
        >
          <ProductForm
            isLoading={productUpdate.isLoading}
            initialValues={product.data ?? {}}
            submitText="Güncelle"
            showUndoBtn
            onSubmit={onSubmit}
          />
        </ProductCard>
      )}
    </>
  )
}

export default ProductEdit
