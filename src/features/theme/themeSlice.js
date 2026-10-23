import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'system' },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload
    },
  },
})

export const { setTheme } = themeSlice.actions
export const selectTheme = (state) => state.theme.mode
export default themeSlice.reducer
