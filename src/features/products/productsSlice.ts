import { createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { axiosMockInstance } from "../../lib/axios"
import type { ResponseStatus } from "../../utils/types"

export type Product = {
  id: number
  name: string
  price: number
  description: string
  category: string
}

export type ProductsSliceState = {
  listFilter: {
    query: string
    category: string
  }
  listResponse: ResponseStatus & {
    data: Product[]
    filteredData: Product[]
  }
  detailResponse: ResponseStatus & {
    data: Product | null
  }
  updateResponse: ResponseStatus & {
    data: Product | null
  }
  deleteResponse: ResponseStatus & {
    data: Product | null
  }
  categoryListResponse: ResponseStatus & {
    data: Product["category"][]
  }
}

const initialState: ProductsSliceState = {
  listFilter: {
    query: "",
    category: "",
  },
  listResponse: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: [],
    filteredData: [],
  },
  detailResponse: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
  },
  updateResponse: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
  },
  deleteResponse: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
  },
  categoryListResponse: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: [],
  },
}

export const getProducts = createAsyncThunk("getProducts", async () => {
  const response = await axiosMockInstance.get<Product[]>("/products")
  const data: Product[] = response.data

  return data
})

export const getProduct = createAsyncThunk(
  "getProduct",
  async (id: Product["id"] | string) => {
    const response = await axiosMockInstance.get<Product>(
      `/products/${String(id)}`,
    )
    const data: Product = response.data
    return data
  },
)

export const updateProduct = createAsyncThunk(
  "updateProduct",
  async (product: Product) => {
    const response = await axiosMockInstance.patch<Product>(
      `/products/${String(product.id)}`,
      product,
    )
    const data: Product = response.data
    return data
  },
)

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (id: Product["id"]) => {
    const response = await axiosMockInstance.delete<Product>(
      `/products/${String(id)}`,
    )
    const data: Product = response.data
    return data
  },
)

export const getProductsCategories = createAsyncThunk(
  "getProductsCategories",
  async () => {
    const response = await axiosMockInstance.get<Product["category"][]>(
      "/products/categories",
    )
    const data: Product["category"][] = response.data

    return data
  },
)

export const productsSlice = createAppSlice({
  name: "products",
  initialState,
  reducers: create => ({
    setProductsFilter: create.reducer(
      (state, action: { payload: { query?: string; category?: string } }) => {
        if (
          action.payload.query !== undefined &&
          typeof action.payload.query === "string"
        ) {
          state.listFilter.query = action.payload.query.toLowerCase()
        }
        if (
          action.payload.category !== undefined &&
          typeof action.payload.category === "string"
        ) {
          state.listFilter.category = action.payload.category
        }

        state.listResponse.filteredData = state.listResponse.data.filter(
          product => {
            const isQueryMatch =
              product.name.toLowerCase().includes(state.listFilter.query) ||
              product.description.toLowerCase().includes(state.listFilter.query)
            const isCategoryMatch =
              product.category === state.listFilter.category

            const { query, category } = state.listFilter

            if (query && category) return isQueryMatch && isCategoryMatch
            if (query && !category) {
              return isQueryMatch
            }
            if (!query && category) {
              return isCategoryMatch
            }
            return true
          },
        )
      },
    ),
    resetProduct: create.reducer(state => {
      state.detailResponse = initialState.detailResponse
    }),
    resetProductUpdate: create.reducer(state => {
      state.updateResponse = initialState.updateResponse
    }),
    resetProductDelete: create.reducer(state => {
      state.deleteResponse = initialState.deleteResponse
    }),
  }),
  extraReducers: builder => {
    builder
      .addCase(getProducts.pending, state => {
        state.listResponse.isLoading = true
        state.listResponse.isSuccess = false
        state.listResponse.isError = false
        state.listResponse.data = []
        state.listResponse.filteredData = []
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.listResponse.isLoading = false
        state.listResponse.isSuccess = true
        state.listResponse.isError = false
        state.listResponse.data = action.payload
        state.listResponse.filteredData = action.payload
      })
      .addCase(getProducts.rejected, state => {
        state.listResponse.isLoading = false
        state.listResponse.isSuccess = false
        state.listResponse.isError = true
        state.listResponse.data = []
        state.listResponse.filteredData = []
      })

    builder
      .addCase(getProduct.pending, state => {
        state.detailResponse.isLoading = true
        state.detailResponse.isSuccess = false
        state.detailResponse.isError = false
        state.detailResponse.data = null
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.detailResponse.isLoading = false
        state.detailResponse.isSuccess = true
        state.detailResponse.isError = false
        state.detailResponse.data = action.payload
      })
      .addCase(getProduct.rejected, state => {
        state.detailResponse.isLoading = false
        state.detailResponse.isSuccess = false
        state.detailResponse.isError = true
        state.detailResponse.data = null
      })

    builder
      .addCase(updateProduct.pending, state => {
        state.updateResponse.isLoading = true
        state.updateResponse.isSuccess = false
        state.updateResponse.isError = false
        state.updateResponse.data = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateResponse.isLoading = false
        state.updateResponse.isSuccess = true
        state.updateResponse.isError = false
        state.updateResponse.data = action.payload

        const productIndex = state.listResponse.data.findIndex(
          product => product.id === action.payload.id,
        )
        if (productIndex !== -1) {
          state.listResponse.data[productIndex] = action.payload
        }

        const filteredProductIndex = state.listResponse.filteredData.findIndex(
          product => product.id === action.payload.id,
        )
        if (filteredProductIndex !== -1) {
          state.listResponse.filteredData[filteredProductIndex] = action.payload
        }
      })
      .addCase(updateProduct.rejected, state => {
        state.updateResponse.isLoading = false
        state.updateResponse.isSuccess = false
        state.updateResponse.isError = true
        state.updateResponse.data = null
      })

    builder
      .addCase(deleteProduct.pending, state => {
        state.deleteResponse.isLoading = true
        state.deleteResponse.isSuccess = false
        state.deleteResponse.isError = false
        state.deleteResponse.data = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteResponse.isLoading = false
        state.deleteResponse.isSuccess = true
        state.deleteResponse.isError = false
        state.deleteResponse.data = action.payload

        const productIndex = state.listResponse.data.findIndex(
          product => product.id === action.payload.id,
        )
        if (productIndex !== -1) {
          state.listResponse.data.splice(productIndex, 1)
        }

        const filteredProductIndex = state.listResponse.filteredData.findIndex(
          product => product.id === action.payload.id,
        )
        if (filteredProductIndex !== -1) {
          state.listResponse.filteredData.splice(filteredProductIndex, 1)
        }
      })
      .addCase(deleteProduct.rejected, state => {
        state.deleteResponse.isLoading = false
        state.deleteResponse.isSuccess = false
        state.deleteResponse.isError = true
        state.deleteResponse.data = null
      })

    builder
      .addCase(getProductsCategories.pending, state => {
        state.categoryListResponse.isLoading = true
        state.categoryListResponse.isSuccess = false
        state.categoryListResponse.isError = false
        state.categoryListResponse.data = []
      })
      .addCase(getProductsCategories.fulfilled, (state, action) => {
        state.categoryListResponse.isLoading = false
        state.categoryListResponse.isSuccess = true
        state.categoryListResponse.isError = false
        state.categoryListResponse.data = action.payload
      })
      .addCase(getProductsCategories.rejected, state => {
        state.categoryListResponse.isLoading = false
        state.categoryListResponse.isSuccess = false
        state.categoryListResponse.isError = true
        state.categoryListResponse.data = []
      })
  },
  selectors: {
    selectProducts: products => products.listResponse,
    selectProduct: products => products.detailResponse,
    selectProductUpdate: products => products.updateResponse,
    selectProductDelete: products => products.deleteResponse,
    selectProductsCategories: products => products.categoryListResponse,
  },
})

export const {
  setProductsFilter,
  resetProduct,
  resetProductUpdate,
  resetProductDelete,
} = productsSlice.actions

export const {
  selectProducts,
  selectProduct,
  selectProductUpdate,
  selectProductDelete,
  selectProductsCategories,
} = productsSlice.selectors
