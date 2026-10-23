import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { addToCart, clearCart, decrease, increase, removeFromCart } from '../features/cart/cartSlice'
import cartReducer from '../features/cart/cartSlice'
import { getCouponRule } from '../features/coupons/couponRules'
import { removeCoupon } from '../features/coupons/couponsSlice'
import couponsReducer from '../features/coupons/couponsSlice'
import ordersReducer from '../features/orders/ordersSlice'
import productsReducer from '../features/products/productsSlice'
import { selectTotalPrice } from '../features/cart/selectors'
import themeReducer from '../features/theme/themeSlice'

const couponListener = createListenerMiddleware()

couponListener.startListening({
  matcher: (action) => isAnyOf(addToCart, clearCart, decrease, increase, removeFromCart)(action)
    || action.type === REHYDRATE,
  effect: (_, listenerApi) => {
    const state = listenerApi.getState()
    const code = state.coupons.appliedCode
    const rule = code && getCouponRule(code)

    if (rule && selectTotalPrice(state) < rule.minimumSubtotalCents) {
      listenerApi.dispatch(removeCoupon('Your coupon was removed because the cart no longer meets its minimum.'))
    }
  },
})

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  coupons: couponsReducer,
  theme: themeReducer,
  orders: ordersReducer,
})

const persistedReducer = persistReducer(
  {
    key: 'common-goods',
    storage,
    whitelist: ['cart', 'theme', 'coupons'],
  },
  rootReducer,
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).prepend(couponListener.middleware),
})

export const persistor = persistStore(store)
