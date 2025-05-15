import axios from "axios"
import AxiosMockAdapter from "axios-mock-adapter"

import {
  getMockProducts,
  getMockUser,
  getMockUsers,
  getUserIdFromUrl,
} from "../utils/mock"
import type { User } from "../features/users/usersSlice"

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
  const userId = getUserIdFromUrl(config.url)
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
  const userId = getUserIdFromUrl(config.url)
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
  const userId = getUserIdFromUrl(config.url)
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
