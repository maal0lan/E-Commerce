import assert from 'node:assert/strict'
import test from 'node:test'
import cartReducer, {
  addToCart,
  clearCart,
  decrease,
  increase,
  removeFromCart,
} from './cartSlice.js'

test('cart stores only product ids, quantities, and price snapshots', () => {
  const state = cartReducer(undefined, addToCart({ id: 12, qty: 2, priceCents: 1999 }))

  assert.deepEqual(state.items, [{ id: 12, qty: 2, priceCents: 1999 }])
})

test('adding an existing item increments its quantity', () => {
  const initial = { items: [{ id: 12, qty: 1, priceCents: 1999 }] }
  const state = cartReducer(initial, addToCart({ id: 12, qty: 2, priceCents: 1999 }))

  assert.equal(state.items[0].qty, 3)
})

test('decreasing the last unit removes its row', () => {
  const initial = { items: [{ id: 12, qty: 1, priceCents: 1999 }] }

  assert.deepEqual(cartReducer(initial, decrease(12)).items, [])
})

test('increase, remove, and clear update cart items', () => {
  const initial = {
    items: [
      { id: 12, qty: 1, priceCents: 1999 },
      { id: 13, qty: 1, priceCents: 500 },
    ],
  }
  const increased = cartReducer(initial, increase(12))
  const removed = cartReducer(increased, removeFromCart(13))

  assert.equal(removed.items[0].qty, 2)
  assert.deepEqual(cartReducer(removed, clearCart()).items, [])
})
