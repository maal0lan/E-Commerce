import { lazy, Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Header from './components/Header'
import ThemeSync from './components/ThemeSync'
import { fetchProducts } from './features/products/productsSlice'
import './App.css'

const ProductListPage = lazy(() => import('./pages/ProductListPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const OrderPlacedPage = lazy(() => import('./pages/OrderPlacedPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ApproachPage = lazy(() => import('./pages/ApproachPage'))

const App = () => {
  const dispatch = useDispatch()
  const [toast, setToast] = useState('')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  return (
    <div className="app-shell">
      <ThemeSync />
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<main className="route-loading" aria-live="polite">Loading the shop...</main>}>
          <Routes>
            <Route element={<ProductListPage notify={setToast} />} path="/" />
            <Route element={<ProductDetailPage notify={setToast} />} path="/products/:productId" />
            <Route element={<CartPage notify={setToast} />} path="/cart" />
            <Route element={<ApproachPage />} path="/approach" />
            <Route element={<OrderPlacedPage />} path="/orders/:orderId" />
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
