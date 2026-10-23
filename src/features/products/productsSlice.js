import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchProductRequest, fetchProductsRequest, getFriendlyError } from './productsApi'

const productsAdapter = createEntityAdapter()

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await fetchProductsRequest(signal)
    } catch (error) {
      return rejectWithValue(getFriendlyError(error))
    }
  },
  {
    condition: (_, { getState }) => getState().products.status !== 'succeeded'
      && getState().products.status !== 'loading',
  },
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { signal, rejectWithValue }) => {
    try {
      return await fetchProductRequest(id, signal)
    } catch (error) {
      return rejectWithValue(getFriendlyError(error))
    }
  },
  {
    condition: (id, { getState }) => !getState().products.entities[id]
      && getState().products.detailStatus[id] !== 'loading',
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState({
    status: 'idle',
    error: null,
    detailStatus: {},
    detailErrors: {},
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        productsAdapter.setAll(state, action.payload)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.condition) return
        if (action.meta.aborted) {
          state.status = 'idle'
          return
        }
        state.status = 'failed'
        state.error = action.payload || 'Unable to load products.'
      })
      .addCase(fetchProductById.pending, (state, action) => {
        state.detailStatus[action.meta.arg] = 'loading'
        delete state.detailErrors[action.meta.arg]
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        productsAdapter.upsertOne(state, action.payload)
        state.detailStatus[action.meta.arg] = 'succeeded'
        delete state.detailErrors[action.meta.arg]
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        if (action.meta.condition) return
        if (action.meta.aborted) {
          state.detailStatus[action.meta.arg] = 'idle'
          return
        }
        state.detailStatus[action.meta.arg] = 'failed'
        state.detailErrors[action.meta.arg] = action.payload || 'Unable to load this product.'
      })
  },
})

export const productSelectors = productsAdapter.getSelectors((state) => state.products)
export default productsSlice.reducer
