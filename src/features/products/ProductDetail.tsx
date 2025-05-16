import React from "react"
import { useNavigate, useParams } from "react-router"
import { Flex, message } from "antd"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { getProduct, resetProduct, selectProduct } from "./productsSlice"
import ProductItem from "./ProductItem"
import ProductCard from "./ProductCard"
import ProductBreadCrumb from "./ProductBreadCrumb"

const pageTitle = "Ürün Detayı"
const pageDescription = "Ürün bilgilerini görüntüleyebilirsiniz."
const errorMessage =
  "Ürün yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const product = useAppSelector(selectProduct)
  const [messageApi, messageContextHolder] = message.useMessage()

  React.useEffect(() => {
    if (productId) {
      void dispatch(getProduct(productId))
    }
  }, [productId, dispatch])

  React.useEffect(() => {
    if (product.isError) {
      messageApi.open({
        type: "error",
        content: errorMessage,
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
    }
  }, [dispatch])

  return (
    <>
      {messageContextHolder}
      <ProductBreadCrumb title={pageTitle} />
      {!product.isError && (
        <ProductCard
          isLoading={product.isLoading}
          title={pageTitle}
          description={pageDescription}
        >
          <Flex vertical gap={6} wrap="wrap">
            <ProductItem label="Ürün İsmi">{product.data?.name}</ProductItem>
            <ProductItem label="Fiyat (₺)">{product.data?.price}</ProductItem>
            <ProductItem label="Kategori">{product.data?.category}</ProductItem>
            <ProductItem label="Açıklama">
              {product.data?.description}
            </ProductItem>
          </Flex>
        </ProductCard>
      )}
    </>
  )
}

export default ProductDetail
