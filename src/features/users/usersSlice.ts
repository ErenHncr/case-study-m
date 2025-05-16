import { createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { axiosMockInstance } from "../../lib/axios"
import type { ResponseStatus } from "../../utils/types"

export type User = {
  id: number
  name: string
  email: string
}

export type UsersSliceState = {
  listFilter: {
    query: string
  }
  listResponse: ResponseStatus & {
    data: User[]
    filteredData: User[]
  }
  detailResponse: ResponseStatus & {
    data: User | null
  }
  updateResponse: ResponseStatus & {
    data: User | null
  }
  deleteResponse: ResponseStatus & {
    data: User | null
  }
}

const initialState: UsersSliceState = {
  listFilter: {
    query: "",
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
}

export const getUsers = createAsyncThunk("getUsers", async () => {
  const response = await axiosMockInstance.get<User[]>("/users")
  const data: User[] = response.data

  return data
})

export const getUser = createAsyncThunk(
  "getUser",
  async (id: User["id"] | string) => {
    const response = await axiosMockInstance.get<User>(`/users/${String(id)}`)
    const data: User = response.data
    return data
  },
)

export const updateUser = createAsyncThunk(
  "updateUser",
  async ({ id, name, email }: User) => {
    const response = await axiosMockInstance.patch<User>(
      `/users/${String(id)}`,
      {
        name,
        email,
      },
    )
    const data: User = response.data
    return data
  },
)

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id: User["id"]) => {
    const response = await axiosMockInstance.delete<User>(
      `/users/${String(id)}`,
    )
    const data: User = response.data
    return data
  },
)

export const usersSlice = createAppSlice({
  name: "users",
  initialState,
  reducers: create => ({
    setUsersFilterQuery: create.reducer(
      (state, action: { payload: string }) => {
        state.listFilter.query = action.payload.toLowerCase()
        if (action.payload) {
          state.listResponse.filteredData = state.listResponse.data.filter(
            user =>
              user.name.toLowerCase().includes(state.listFilter.query) ||
              user.email.toLowerCase().includes(state.listFilter.query),
          )
        } else {
          state.listResponse.filteredData = state.listResponse.data
        }
      },
    ),
    resetUser: create.reducer(state => {
      state.detailResponse = initialState.detailResponse
    }),
    resetUserUpdate: create.reducer(state => {
      state.updateResponse = initialState.updateResponse
    }),
    resetUserDelete: create.reducer(state => {
      state.deleteResponse = initialState.deleteResponse
    }),
  }),
  extraReducers: builder => {
    builder
      .addCase(getUsers.pending, state => {
        state.listResponse.isLoading = true
        state.listResponse.isSuccess = false
        state.listResponse.isError = false
        state.listResponse.data = []
        state.listResponse.filteredData = []
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.listResponse.isLoading = false
        state.listResponse.isSuccess = true
        state.listResponse.isError = false
        state.listResponse.data = action.payload
        state.listResponse.filteredData = action.payload
      })
      .addCase(getUsers.rejected, state => {
        state.listResponse.isLoading = false
        state.listResponse.isSuccess = false
        state.listResponse.isError = true
        state.listResponse.data = []
        state.listResponse.filteredData = []
      })

    builder
      .addCase(getUser.pending, state => {
        state.detailResponse.isLoading = true
        state.detailResponse.isSuccess = false
        state.detailResponse.isError = false
        state.detailResponse.data = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.detailResponse.isLoading = false
        state.detailResponse.isSuccess = true
        state.detailResponse.isError = false
        state.detailResponse.data = action.payload
      })
      .addCase(getUser.rejected, state => {
        state.detailResponse.isLoading = false
        state.detailResponse.isSuccess = false
        state.detailResponse.isError = true
        state.detailResponse.data = null
      })

    builder
      .addCase(updateUser.pending, state => {
        state.updateResponse.isLoading = true
        state.updateResponse.isSuccess = false
        state.updateResponse.isError = false
        state.updateResponse.data = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateResponse.isLoading = false
        state.updateResponse.isSuccess = true
        state.updateResponse.isError = false
        state.updateResponse.data = action.payload

        const userIndex = state.listResponse.data.findIndex(
          user => user.id === action.payload.id,
        )
        if (userIndex !== -1) {
          state.listResponse.data[userIndex] = action.payload
        }

        const filteredUserIndex = state.listResponse.filteredData.findIndex(
          user => user.id === action.payload.id,
        )
        if (filteredUserIndex !== -1) {
          state.listResponse.filteredData[filteredUserIndex] = action.payload
        }
      })
      .addCase(updateUser.rejected, state => {
        state.updateResponse.isLoading = false
        state.updateResponse.isSuccess = false
        state.updateResponse.isError = true
        state.updateResponse.data = null
      })

    builder
      .addCase(deleteUser.pending, state => {
        state.deleteResponse.isLoading = true
        state.deleteResponse.isSuccess = false
        state.deleteResponse.isError = false
        state.deleteResponse.data = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteResponse.isLoading = false
        state.deleteResponse.isSuccess = true
        state.deleteResponse.isError = false
        state.deleteResponse.data = action.payload

        const userIndex = state.listResponse.data.findIndex(
          user => user.id === action.payload.id,
        )
        if (userIndex !== -1) {
          state.listResponse.data.splice(userIndex, 1)
        }

        const filteredUserIndex = state.listResponse.filteredData.findIndex(
          user => user.id === action.payload.id,
        )
        if (filteredUserIndex !== -1) {
          state.listResponse.filteredData.splice(filteredUserIndex, 1)
        }
      })
      .addCase(deleteUser.rejected, state => {
        state.deleteResponse.isLoading = false
        state.deleteResponse.isSuccess = false
        state.deleteResponse.isError = true
        state.deleteResponse.data = null
      })
  },
  selectors: {
    selectUsers: users => users.listResponse,
    selectUsersFilterQuery: users => users.listFilter.query,
    selectUser: users => users.detailResponse,
    selectUserUpdate: users => users.updateResponse,
    selectUserDelete: users => users.deleteResponse,
  },
})

export const {
  setUsersFilterQuery,
  resetUser,
  resetUserUpdate,
  resetUserDelete,
} = usersSlice.actions

export const {
  selectUsers,
  selectUsersFilterQuery,
  selectUser,
  selectUserUpdate,
  selectUserDelete,
} = usersSlice.selectors
