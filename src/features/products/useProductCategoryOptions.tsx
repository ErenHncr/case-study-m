import React from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  getProductsCategories,
  selectProductsCategories,
} from "./productsSlice"

function useProductCategoryOptions() {
  const dispatch = useAppDispatch()
  const productCategories = useAppSelector(selectProductsCategories)

  const productCategoryOptions = React.useMemo(() => {
    if (Array.isArray(productCategories.data)) {
      return productCategories.data.map(category => ({
        value: category,
        label: category,
      }))
    }
    return []
  }, [productCategories.data])

  React.useEffect(() => {
    if (!productCategories.isLoading && !productCategories.isSuccess) {
      void dispatch(getProductsCategories())
    }
    // eslint-disable-next-line
  }, [])

  return productCategoryOptions
}

export default useProductCategoryOptions
