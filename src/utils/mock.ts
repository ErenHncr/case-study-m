import type { User } from "../features/users/usersSlice"
import mockUsers from "../_mock_/users.json"
import mockProducts from "../_mock_/products.json"

export const getUserIdFromUrl = (url: string | undefined): string | null => {
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
