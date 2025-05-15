import axios from "axios"
import AxiosMockAdapter from "axios-mock-adapter"

import mockUsers from "../_mock_/users.json"
import mockProducts from "../_mock_/products.json"

export const axiosMockInstance = axios.create();

// This sets the mock adapter on the default instance
export const axiosMockAdapterInstance = new AxiosMockAdapter(axiosMockInstance, {
  delayResponse: 1000,
})

axiosMockAdapterInstance.onGet("/users").reply(200, mockUsers)

axiosMockAdapterInstance.onGet("/products").reply(200, mockProducts)