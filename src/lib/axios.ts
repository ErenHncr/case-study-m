import axios from "axios"
import AxiosMockAdapter from "axios-mock-adapter"

import {
  getMockProducts,
  getMockUser,
  getMockUsers,
  getIdFromUrl,
  getMockProduct,
  getMockProductsCategories,
  generateId,
} from "../utils/mock"
import type { User } from "../features/users/usersSlice"
import type { Product } from "../features/products/productsSlice"

export const axiosMockInstance = axios.create()

// This sets the mock adapter on the default instance
export const axiosMockAdapterInstance = new AxiosMockAdapter(
  axiosMockInstance,
  {
    delayResponse: 1000,
  },
)

axiosMockAdapterInstance.onGet("/users").reply(200, getMockUsers())

axiosMockAdapterInstance.onGet(/\/users\/\d+/).reply(function (config) {
  const userId = getIdFromUrl(config.url)
  if (!userId) {
    return [403, { message: "user id is required" }]
  }

  const user = getMockUser(userId)
  if (!user) {
    return [404, { message: "user not found" }]
  }

  return [200, user]
})

axiosMockAdapterInstance.onPatch(/\/users\/\d+/).reply(function (config) {
  const userId = getIdFromUrl(config.url)
  if (!userId) {
    return [403, { message: "user id is required" }]
  }

  const user = getMockUser(userId)
  if (!user) {
    return [404, { message: "user not found" }]
  }

  try {
    const data = config.data as string
    if (!data || typeof data !== "string") {
      return [403, { message: "data is required" }]
    }
    const dataUser = JSON.parse(data) as Partial<User> | null
    if (!dataUser) {
      return [403, { message: "data is required" }]
    }
    const updatedUser = { ...user, ...dataUser }

    return [200, updatedUser]
  } catch {
    return [403, { message: "data is not valid" }]
  }
})

axiosMockAdapterInstance.onDelete(/\/users\/\d+/).reply(function (config) {
  const userId = getIdFromUrl(config.url)
  if (!userId) {
    return [403, { message: "user id is required" }]
  }

  const user = getMockUser(userId)
  if (!user) {
    return [404, { message: "user not found" }]
  }

  return [200, user]
})

axiosMockAdapterInstance.onGet("/products").reply(200, getMockProducts())

axiosMockAdapterInstance.onGet(/\/products\/\d+/).reply(function (config) {
  const productId = getIdFromUrl(config.url)
  if (!productId) {
    return [403, { message: "product id is required" }]
  }

  const product = getMockProduct(productId)
  if (!product) {
    return [404, { message: "product not found" }]
  }

  return [200, product]
})

axiosMockAdapterInstance.onPost("/products").reply(function (config) {
  try {
    const data = config.data as string
    if (!data || typeof data !== "string") {
      return [403, { message: "data is required" }]
    }
    const dataProduct = JSON.parse(data) as Omit<Product, "id"> | null
    if (!dataProduct) {
      return [403, { message: "data is required" }]
    }

    return [200, { id: generateId(), ...dataProduct }]
  } catch {
    return [403, { message: "data is not valid" }]
  }
})

axiosMockAdapterInstance.onPatch(/\/products\/\d+/).reply(function (config) {
  const productId = getIdFromUrl(config.url)
  if (!productId) {
    return [403, { message: "product id is required" }]
  }

  const product = getMockProduct(productId)
  if (!product) {
    return [404, { message: "product not found", id: productId }]
  }

  try {
    const data = config.data as string
    if (!data || typeof data !== "string") {
      return [403, { message: "data is required" }]
    }
    const dataProduct = JSON.parse(data) as Partial<Product> | null
    if (!dataProduct) {
      return [403, { message: "data is required" }]
    }
    const updatedProduct = { ...product, ...dataProduct }

    return [200, updatedProduct]
  } catch {
    return [403, { message: "data is not valid" }]
  }
})

axiosMockAdapterInstance.onDelete(/\/products\/\d+/).reply(function (config) {
  const productId = getIdFromUrl(config.url)
  if (!productId) {
    return [403, { message: "product id is required" }]
  }

  const product = getMockProduct(productId)
  if (!product) {
    return [404, { message: "product not found", id: productId }]
  }

  return [200, product]
})

axiosMockAdapterInstance
  .onGet("/products/categories")
  .reply(200, getMockProductsCategories())
