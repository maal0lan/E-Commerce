import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const { id, qty = 1, priceCents } = action.payload
      const existingItem = state.items.find((item) => item.id === id)

      if (existingItem) {
        existingItem.qty += qty
      } else {
        state.items.push({ id, qty, priceCents })
      }
    },
    increase: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)
      if (item) item.qty += 1
    },
    decrease: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)
      if (!item) return

      if (item.qty <= 1) {
        state.items = state.items.filter((cartItem) => cartItem.id !== action.payload)
      } else {
        item.qty -= 1
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, increase, decrease, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
