import type { AxiosError } from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"

import type { ResponseStatus } from "../../utils/types"
import { axiosMockInstance } from "../../lib/axios"
import { createAppSlice } from "../../app/createAppSlice"

export type Product = {
  id: number
  name: string
  price: number
  description: string
  category: string
  isFavorite: boolean
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
  createResponse: ResponseStatus & {
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
  createResponse: {
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
  async (id: Product["id"] | string, { rejectWithValue }) => {
    try {
      const response = await axiosMockInstance.get<Product>(
        `/products/${String(id)}`,
      )
      const data: Product = response.data
      return data
    } catch (err) {
      const errorStatus = (err as AxiosError).status
      if (errorStatus === 404) {
        return rejectWithValue({
          id: Number(id),
          status: errorStatus,
        })
      }

      return rejectWithValue({
        status: errorStatus,
      })
    }
  },
)

export const createProduct = createAsyncThunk(
  "createProduct",
  async (product: Omit<Product, "id">) => {
    const response = await axiosMockInstance.post<Product>("/products", product)
    const data: Product = response.data
    return data
  },
)

export const updateProduct = createAsyncThunk(
  "updateProduct",
  async (product: Product, { rejectWithValue }) => {
    try {
      const response = await axiosMockInstance.patch<Product>(
        `/products/${String(product.id)}`,
        product,
      )
      const data: Product = response.data
      return data
    } catch (err) {
      const errorStatus = (err as AxiosError).status
      if (errorStatus === 404) {
        return rejectWithValue({
          id: product.id,
          data: product,
          status: errorStatus,
        })
      }

      return rejectWithValue({
        status: errorStatus,
      })
    }
  },
)

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (id: Product["id"], { rejectWithValue }) => {
    try {
      const response = await axiosMockInstance.delete<Product>(
        `/products/${String(id)}`,
      )
      const data: Product = response.data
      return data
    } catch (err) {
      const errorStatus = (err as AxiosError).status
      if (errorStatus === 404) {
        return rejectWithValue({
          id,
          status: errorStatus,
        })
      }

      return rejectWithValue({
        status: errorStatus,
      })
    }
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
    resetProductCreate: create.reducer(state => {
      state.createResponse = initialState.createResponse
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
        const data: Product | null =
          state.listResponse.data.find(
            (product: Product) => product.id === action.payload.id,
          ) ?? null

        state.detailResponse.isLoading = false
        state.detailResponse.isSuccess = data !== null
        state.detailResponse.isError = data === null
        state.detailResponse.data = data
      })
      .addCase(getProduct.rejected, (state, action) => {
        const payload = action.payload as { id?: number } | undefined
        const productId = payload?.id
        const data: Product | null =
          state.listResponse.data.find(
            (product: Product) => product.id === productId,
          ) ?? null
        state.detailResponse.isLoading = false
        state.detailResponse.isSuccess = data !== null
        state.detailResponse.isError = data === null
        state.detailResponse.data = data
      })

    builder
      .addCase(createProduct.pending, state => {
        state.createResponse.isLoading = true
        state.createResponse.isSuccess = false
        state.createResponse.isError = false
        state.createResponse.data = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createResponse.isLoading = false
        state.createResponse.isSuccess = true
        state.createResponse.isError = false
        state.createResponse.data = action.payload
        state.listResponse.data = [
          state.createResponse.data,
          ...state.listResponse.data,
        ]
        state.listResponse.filteredData = state.listResponse.data
      })
      .addCase(createProduct.rejected, state => {
        state.createResponse.isLoading = false
        state.createResponse.isSuccess = false
        state.createResponse.isError = true
        state.createResponse.data = null
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
      .addCase(updateProduct.rejected, (state, action) => {
        const payload = action.payload as
          | { id?: number; data?: Product }
          | undefined
        const productId = payload?.id
        const productData = payload?.data
        const data: Product | null =
          state.listResponse.data.find(
            (product: Product) => product.id === productId,
          ) ?? null
        if (data) {
          const productIndex = state.listResponse.data.findIndex(
            product => product.id === productId,
          )
          const filteredProductIndex =
            state.listResponse.filteredData.findIndex(
              product => product.id === productId,
            )
          if (productIndex !== -1) {
            state.listResponse.data[productIndex] = { ...data, ...productData }
          }
          if (filteredProductIndex !== -1) {
            state.listResponse.filteredData[filteredProductIndex] = {
              ...data,
              ...productData,
            }
          }
        }

        state.updateResponse.isLoading = false
        state.updateResponse.isSuccess = data !== null
        state.updateResponse.isError = data === null
        state.updateResponse.data = data
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
      .addCase(deleteProduct.rejected, (state, action) => {
        let productIndex = -1
        let filteredProductIndex = -1
        const payload = action.payload as { id?: number } | undefined
        const productId = payload?.id
        if (productId) {
          productIndex = state.listResponse.data.findIndex(
            product => product.id === productId,
          )
          if (productIndex !== -1) {
            state.listResponse.data.splice(productIndex, 1)
          }

          filteredProductIndex = state.listResponse.filteredData.findIndex(
            product => product.id === productId,
          )
          if (filteredProductIndex !== -1) {
            state.listResponse.filteredData.splice(filteredProductIndex, 1)
          }
        }

        state.deleteResponse.isLoading = false
        state.deleteResponse.isSuccess = productIndex !== -1
        state.deleteResponse.isError = productIndex === -1
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
    selectProductCreate: products => products.createResponse,
    selectProductUpdate: products => products.updateResponse,
    selectProductDelete: products => products.deleteResponse,
    selectProductsCategories: products => products.categoryListResponse,
  },
})

export const {
  setProductsFilter,
  resetProduct,
  resetProductCreate,
  resetProductUpdate,
  resetProductDelete,
} = productsSlice.actions

export const {
  selectProducts,
  selectProduct,
  selectProductCreate,
  selectProductUpdate,
  selectProductDelete,
  selectProductsCategories,
} = productsSlice.selectors
