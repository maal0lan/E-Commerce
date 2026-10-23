import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import { addToCart } from '../features/cart/cartSlice'
import {
  selectCategories,
  selectPaginatedProducts,
  selectProductError,
  selectProductStatus,
} from '../features/products/selectors'
import { fetchProducts } from '../features/products/productsSlice'

const PAGE_SIZE = 8
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const ProductListPage = ({ notify }) => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = useSelector(selectProductStatus)
  const error = useSelector(selectProductError)
  const categories = useSelector(selectCategories)
  const search = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'featured'
  const requestedPage = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
  const filters = useMemo(() => ({
    search,
    category,
    sort,
    page: requestedPage,
    pageSize: PAGE_SIZE,
  }), [category, requestedPage, search, sort])
  const result = useSelector((state) => selectPaginatedProducts(state, filters))

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const updatePage = (page) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(page))
    setSearchParams(next)
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const addProduct = (product) => {
    dispatch(addToCart({
      id: product.id,
      qty: 1,
      priceCents: Math.round(product.price * 100),
    }))
    notify('Added to your bag')
  }

  return (
    <main>
      <section className="collection collection--catalog" id="shop">
        <div className="catalog-hero">
          <div>
            <p className="section-kicker">A little more considered</p>
            <h1>Everyday, made better.</h1>
          </div>
          <p>Useful pieces, chosen for quality and lasting appeal. Find something that feels right for every day.</p>
        </div>
        <div className="collection__heading">
          <div>
            <p className="section-kicker">The collection</p>
            <h2>Shop all goods.</h2>
          </div>
          <p>Useful pieces. A fair price. Nothing extra.</p>
        </div>

        <div aria-label="Filter products" className="catalog-controls">
          <div aria-label="Product categories" className="category-list">
            <button
              aria-pressed={!category}
              className={!category ? 'category-chip category-chip--active' : 'category-chip'}
              onClick={() => updateFilter('category', '')}
              type="button"
            >
              All
            </button>
            {categories.map((item) => (
              <button
                aria-pressed={category === item}
                className={category === item ? 'category-chip category-chip--active' : 'category-chip'}
                key={item}
                onClick={() => updateFilter('category', item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <label className="sort-control">
            <span>Sort</span>
            <select onChange={(event) => updateFilter('sort', event.target.value)} value={sort}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {status === 'loading' && (
          <>
            <p aria-live="polite" className="catalog-message">Loading products...</p>
            <div aria-label="Loading products" className="product-grid">
              {Array.from({ length: PAGE_SIZE }, (_, index) => <ProductSkeleton key={index} />)}
            </div>
          </>
        )}
        {status === 'failed' && (
          <div className="error-box" role="alert">
            <p>{error}</p>
            <Button onClick={() => dispatch(fetchProducts())}>Try again</Button>
          </div>
        )}
        {status === 'succeeded' && result.total === 0 && (
          <div className="catalog-empty">
            <p>No products match those filters.</p>
            <button className="text-link" onClick={() => setSearchParams({})} type="button">Clear filters</button>
          </div>
        )}
        {status === 'succeeded' && result.total > 0 && (
          <>
            <div aria-live="polite" className="catalog-result-count">
              {result.total} {result.total === 1 ? 'find' : 'finds'}
              {search ? <> for <strong>“{search}”</strong></> : null}
            </div>
            <div className="product-grid">
              {result.products.map((product) => (
                <ProductCard key={product.id} onAdd={addProduct} product={product} />
              ))}
            </div>
            {result.pageCount > 1 && (
              <Pagination onPageChange={updatePage} page={result.page} pageCount={result.pageCount} />
            )}
          </>
        )}
        <div className="collection-footnote">
          <span>Carefully picked, ready for everyday life.</span>
          <Link to="/cart">Review your bag</Link>
        </div>
      </section>
    </main>
  )
}

export default ProductListPage
