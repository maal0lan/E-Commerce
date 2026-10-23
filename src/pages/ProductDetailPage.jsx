import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import ProductSkeleton from '../components/ProductSkeleton'
import QtyStepper from '../components/QtyStepper'
import { addToCart } from '../features/cart/cartSlice'
import {
  selectProductById,
  selectProductDetailError,
  selectProductDetailStatus,
  selectRelatedProducts,
} from '../features/products/selectors'
import { fetchProductById } from '../features/products/productsSlice'
import formatPrice from '../utils/formatPrice'

const ProductDetailPage = ({ notify }) => {
  const { productId } = useParams()
  const id = Number(productId)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector((state) => selectProductById(state, id))
  const status = useSelector((state) => selectProductDetailStatus(state, id))
  const error = useSelector((state) => selectProductDetailError(state, id))
  const related = useSelector((state) => selectRelatedProducts(state, id, product?.category))
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    if (Number.isInteger(id) && id > 0) {
      const request = dispatch(fetchProductById(id))
      return () => request.abort()
    }

    return undefined
  }, [dispatch, id])

  const addProduct = () => {
    dispatch(addToCart({
      id: product.id,
      qty: quantity,
      priceCents: Math.round(product.price * 100),
    }))
    notify(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to your bag`)
  }

  if (!Number.isInteger(id) || id <= 0 || (status === 'failed' && error?.includes('couldn’t find'))) {
    return (
      <main className="product-state">
        <h1>Product not found</h1>
        <Link className="text-link" to="/">Back to the collection</Link>
      </main>
    )
  }

  if (!product && status === 'failed') {
    return (
      <main className="product-state">
        <div className="error-box" role="alert">
          <p>{error}</p>
          <Button onClick={() => dispatch(fetchProductById(id))}>Try again</Button>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="product-state">
        <p aria-live="polite">Loading product...</p>
        <div className="product-detail-skeleton"><ProductSkeleton /></div>
      </main>
    )
  }

  return (
    <main className="product-detail-page">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link to="/">Shop</Link><span aria-hidden="true">/</span>
        <Link to={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">{product.title}</span>
      </nav>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <ProductImage
              alt={product.title}
              category={product.category}
              className="product-gallery__image"
              src={activeImage || product.image}
            />
          </div>
          <div aria-label="Product images" className="product-gallery__thumbnails">
            <button
              aria-label={`Show image of ${product.title}`}
              aria-pressed={!activeImage || activeImage === product.image}
              className="product-gallery__thumbnail product-gallery__thumbnail--active"
              onClick={() => setActiveImage(product.image)}
              type="button"
            >
              <ProductImage
                alt=""
                category={product.category}
                className="product-gallery__thumbnail-image"
                src={product.image}
              />
            </button>
          </div>
        </div>

        <div className="product-detail__info">
          <p className="section-kicker">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-rating">
            <span aria-label={`${product.rating.rate} out of 5 stars`}>★ {product.rating.rate}</span>
            <span>{product.rating.count} reviews</span>
          </p>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>
          <div className="product-detail__purchase">
            <QtyStepper label="Quantity" onChange={setQuantity} value={quantity} />
            <Button onClick={addProduct}>Add to bag</Button>
          </div>
          <Button className="product-detail__go-cart" onClick={() => navigate('/cart')} variant="quiet">
            Go to bag
          </Button>
          <p className="product-detail__shipping">Free shipping on orders over $100 after discounts.</p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-products">
          <div className="collection__heading">
            <div><p className="section-kicker">A few more finds</p><h2>You may also like.</h2></div>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                onAdd={(relatedProduct) => {
                  dispatch(addToCart({
                    id: relatedProduct.id,
                    qty: 1,
                    priceCents: Math.round(relatedProduct.price * 100),
                  }))
                  notify('Added to your bag')
                }}
                product={item}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductDetailPage
