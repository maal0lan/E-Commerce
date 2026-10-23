import { createSelector } from '@reduxjs/toolkit'
import { productSelectors } from './productsSlice'

export const selectAllProducts = productSelectors.selectAll
export const selectProductById = productSelectors.selectById
export const selectProductStatus = (state) => state.products.status
export const selectProductError = (state) => state.products.error
export const selectProductDetailStatus = (state, id) => state.products.detailStatus[id] || 'idle'
export const selectProductDetailError = (state, id) => state.products.detailErrors[id] || null

export const selectCategories = createSelector(
  [selectAllProducts],
  (products) => [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b)),
)

export const selectFilteredProducts = createSelector(
  [
    selectAllProducts,
    (_, filters) => filters.search.trim().toLowerCase(),
    (_, filters) => filters.category,
  ],
  (products, search, category) => products.filter((product) => {
    const matchesSearch = !search
      || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(search)
    return matchesSearch && (!category || product.category === category)
  }),
)

export const selectSortedProducts = createSelector(
  [selectFilteredProducts, (_, filters) => filters.sort],
  (products, sort) => [...products].sort((first, second) => {
    if (sort === 'price-asc') return first.price - second.price
    if (sort === 'price-desc') return second.price - first.price
    return first.id - second.id
  }),
)

export const selectPaginatedProducts = createSelector(
  [selectSortedProducts, (_, filters) => filters.page, (_, filters) => filters.pageSize],
  (products, page, pageSize) => {
    const pageCount = Math.max(1, Math.ceil(products.length / pageSize))
    const currentPage = Math.min(Math.max(1, page), pageCount)
    const start = (currentPage - 1) * pageSize

    return {
      products: products.slice(start, start + pageSize),
      total: products.length,
      page: currentPage,
      pageCount,
    }
  },
)

export const selectRelatedProducts = createSelector(
  [selectAllProducts, (_, productId) => productId, (_, __, category) => category],
  (products, productId, category) => products
    .filter((product) => product.id !== productId && product.category === category)
    .slice(0, 4),
)
