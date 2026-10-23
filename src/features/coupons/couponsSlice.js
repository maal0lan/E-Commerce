import { createSlice } from '@reduxjs/toolkit'

const couponsSlice = createSlice({
  name: 'coupons',
  initialState: { appliedCode: null, notice: null },
  reducers: {
    applyCoupon: (state, action) => {
      state.appliedCode = action.payload
      state.notice = null
    },
    removeCoupon: (state, action) => {
      state.appliedCode = null
      state.notice = action.payload || null
    },
  },
})

export const { applyCoupon, removeCoupon } = couponsSlice.actions
export default couponsSlice.reducer
