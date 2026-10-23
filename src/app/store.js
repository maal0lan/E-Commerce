import { configureStore } from '@reduxjs/toolkit'
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
import cartReducer from '../features/cart/cartSlice'

const rootReducer = combineReducers({
  cart: cartReducer,
})

const persistedReducer = persistReducer(
  {
    key: 'common-goods',
    storage,
    whitelist: ['cart'],
  },
  rootReducer,
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})

export const persistor = persistStore(store)
