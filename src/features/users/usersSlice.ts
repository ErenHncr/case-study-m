import { createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { axiosMockInstance } from "../../lib/axios"

export type User = {
  id: number
  name: string
  email: string
}

export type UsersSliceState = {
  listResponse: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    data: User[]
  }
}

const initialState: UsersSliceState = {
  listResponse: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: [],
  },
}

export const getUsers = createAsyncThunk("getUsers", async () => {
  const response = await axiosMockInstance.get<User[]>("/users")
  const data: User[] = response.data
  return data
})

export const usersSlice = createAppSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUsers.pending, state => {
        state.listResponse.isLoading = true
        state.listResponse.isSuccess = false
        state.listResponse.isError = false
        state.listResponse.data = []
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.listResponse.isLoading = false
        state.listResponse.isSuccess = true
        state.listResponse.isError = false
        state.listResponse.data = action.payload
      })
      .addCase(getUsers.rejected, state => {
        state.listResponse.isLoading = false
        state.listResponse.isSuccess = false
        state.listResponse.isError = true
        state.listResponse.data = []
      })
  },
  selectors: {
    selectUsers: users => users.listResponse,
  },
})

export const { selectUsers } = usersSlice.selectors
