import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setItemQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id)

      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity
      }
    },
  },
})

export const { addItem, removeItem, setItemQuantity } = cartSlice.actions
export default cartSlice.reducer
