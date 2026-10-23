import { createSlice } from '@reduxjs/toolkit'

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [] },
  reducers: {
    placeOrder: (state, action) => {
      state.items.unshift(action.payload)
    },
  },
})

export const { placeOrder } = ordersSlice.actions
export const selectOrderById = (state, orderId) => state.orders.items.find((order) => order.id === orderId)
export default ordersSlice.reducer
