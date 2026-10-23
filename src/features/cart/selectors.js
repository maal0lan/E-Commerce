import { createSelector } from '@reduxjs/toolkit'
import { productSelectors } from '../products/productsSlice'

export const selectCartItems = (state) => state.cart.items
export const selectTotalItems = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.qty, 0),
)
export const selectTotalPrice = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.priceCents * item.qty, 0),
)
export const selectCartCount = selectTotalItems
export const selectCartSubtotal = selectTotalPrice
export const selectCartDetails = createSelector(
  [selectCartItems, (state) => state.products.entities],
  (items, products) => items.map((item) => ({
    ...item,
    product: products[item.id] || null,
  })),
)

export const selectProductFromCart = (state, id) => productSelectors.selectById(state, id)
