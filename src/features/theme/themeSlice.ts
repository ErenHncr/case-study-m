import { createAppSlice } from "../../lib/redux/createAppSlice"

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
export type ThemeSliceState = {
  value: Theme
}

const initialState: ThemeSliceState = {
  value: Theme.LIGHT,
}

export const themeSlice = createAppSlice({
  name: "theme",
  initialState,
  reducers: create => ({
    changeTheme: create.reducer(
      (
        state,
        action: {
          payload: Theme
        },
      ) => {
        state.value = action.payload
      },
    ),
  }),
  selectors: {
    selectTheme: theme => theme.value,
  },
})

export const { changeTheme } = themeSlice.actions

export const { selectTheme } = themeSlice.selectors
