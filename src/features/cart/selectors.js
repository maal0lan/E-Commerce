export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce(
  (total, item) => total + item.quantity,
  0,
)
export const selectCartSubtotal = (state) => state.cart.items.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
)
