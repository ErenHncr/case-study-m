import mockUsers from "../_mock_/users.json"
import mockProducts from "../_mock_/products.json"
import type { User } from "../features/users/usersSlice"
import type { Product } from "../features/products/productsSlice"

export const generateId = (): number => Math.floor(Math.random() * 100001)

export const getIdFromUrl = (url: string | undefined): string | null => {
  const userId = url?.split("/").pop()
  if (!userId) {
    return null
  }
  return userId
}

export const getMockUsers = () => mockUsers

export const getMockUser = (userId: string | null): User | null => {
  if (!userId) {
    return null
  }
  const user = mockUsers.find(user => user.id === Number(userId))
  if (!user) {
    return null
  }
  return user
}

export const getMockProducts = () => mockProducts

export const getMockProduct = (productId: string | null): Product | null => {
  if (!productId) {
    return null
  }
  const product = mockProducts.find(product => product.id === Number(productId))
  if (!product) {
    return null
  }
  return product
}

export const getMockProductsCategories = (): Product["category"][] =>
  Array.from(new Set(mockProducts.map(product => product.category)))
