import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
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

const EMPTY_RELATED_PRODUCTS = []

const StarDisplay = ({ rating, label }) => {
  const filledStars = Math.round(rating)

  return (
    <span aria-label={label} className="star-display" role="img">
      {Array.from({ length: 5 }, (_, index) => (index < filledStars ? '★' : '☆'))}
    </span>
  )
}

const ProductDetailPage = ({ notify }) => {
  const { productId } = useParams()
  const id = Number(productId)
  const dispatch = useDispatch()
  const product = useSelector((state) => selectProductById(state, id))
  const status = useSelector((state) => selectProductDetailStatus(state, id))
  const error = useSelector((state) => selectProductDetailError(state, id))
  const related = useSelector((state) => (
    product ? selectRelatedProducts(state, id, product.category) : EMPTY_RELATED_PRODUCTS
  ))
  const relatedProducts = related.filter((item) => item?.id !== undefined)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    if (Number.isInteger(id) && id > 0) {
      const request = dispatch(fetchProductById(id))
      return () => request.abort()
    }

    return undefined
  }, [dispatch, id])

  useEffect(() => {
    try {
      const storedReviews = JSON.parse(localStorage.getItem(`common-goods-reviews-${id}`) || '[]')
      setReviews(Array.isArray(storedReviews) ? storedReviews : [])
    } catch {
      setReviews([])
    }
    setReviewMessage('')
    setReviewRating(0)
  }, [id])

  if (!Number.isInteger(id) || id <= 0 || (status === 'failed' && error?.includes('couldn’t find'))) {
    return (
      <main className="product-state">
        <h1>Product not found</h1>
        <Link className="text-link" to="/products">Back to the collection</Link>
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

  const addProduct = () => {
    dispatch(addToCart({
      id: product.id,
      qty: quantity,
      priceCents: Math.round(product.price * 100),
    }))
    notify(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to your bag`)
  }

  const submitReview = (event) => {
    event.preventDefault()
    if (!reviewRating) {
      setReviewMessage('Choose a star rating before submitting.')
      return
    }

    const nextReviews = [{
      id: Date.now(),
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewText.trim(),
      createdAt: new Date().toISOString(),
    }, ...reviews]

    localStorage.setItem(`common-goods-reviews-${id}`, JSON.stringify(nextReviews))
    setReviews(nextReviews)
    setReviewName('')
    setReviewText('')
    setReviewRating(0)
    setReviewMessage('Thanks for sharing your review.')
  }

  return (
    <main className="product-detail-page">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link to="/products">Shop</Link><span aria-hidden="true">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">{product.title}</span>
      </nav>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <ProductImage
              alt={product.title}
              category={product.category}
              className="product-gallery__image"
              src={product.image}
            />
          </div>
        </div>

        <div className="product-detail__info">
          <p className="section-kicker">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-rating">
            <StarDisplay label={`${product.rating.rate} out of 5 stars`} rating={product.rating.rate} />
            <strong>{Number(product.rating.rate).toFixed(1)}</strong>
            <a href="#reviews">{product.rating.count} ratings</a>
          </p>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>
          <div className="product-detail__purchase">
            <QtyStepper label="Quantity" onChange={setQuantity} value={quantity} />
            <Button onClick={addProduct}>Add to bag</Button>
          </div>
          <p className="product-detail__shipping">Free shipping on orders over $100 after discounts.</p>
        </div>
      </section>

      <section aria-labelledby="reviews-heading" className="review-section" id="reviews">
        <div className="review-section__heading">
          <div>
            <p className="section-kicker">Customer notes</p>
            <h2 id="reviews-heading">Reviews</h2>
          </div>
          <div className="review-summary">
            <strong className="review-summary__score">{Number(product.rating.rate).toFixed(1)}</strong>
            <div>
              <StarDisplay label={`${product.rating.rate} out of 5 stars`} rating={product.rating.rate} />
              <span>{product.rating.count} customer ratings</span>
            </div>
          </div>
        </div>
        <div className="review-section__body">
          <form className="review-form" onSubmit={submitReview}>
            <h3>Share your experience</h3>
            <fieldset className="review-form__rating">
              <legend>Your rating</legend>
              <div>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                    aria-pressed={reviewRating === rating}
                    className={rating <= reviewRating ? 'review-form__star is-selected' : 'review-form__star'}
                    key={rating}
                    onClick={() => setReviewRating(rating)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor={`review-name-${product.id}`}>Name</label>
            <input
              autoComplete="name"
              id={`review-name-${product.id}`}
              onChange={(event) => setReviewName(event.target.value)}
              required
              value={reviewName}
            />
            <label htmlFor={`review-text-${product.id}`}>Review</label>
            <textarea
              id={`review-text-${product.id}`}
              onChange={(event) => setReviewText(event.target.value)}
              required
              rows="4"
              value={reviewText}
            />
            <Button type="submit" variant="quiet">Submit review</Button>
            <p aria-live="polite" className="review-form__message" role="status">{reviewMessage}</p>
            <p className="review-form__note">Your review is saved in this browser.</p>
          </form>
          <div aria-label="Written reviews" className="review-list">
            {reviews.length ? reviews.map((review) => (
              <article className="review-item" key={review.id}>
                <div className="review-item__meta">
                  <strong>{review.name}</strong>
                  <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
                </div>
                <StarDisplay label={`${review.rating} out of 5 stars`} rating={review.rating} />
                <p>{review.comment}</p>
              </article>
            )) : (
              <p className="review-list__empty">No written reviews yet. Be the first to share a note.</p>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="collection__heading">
            <div><p className="section-kicker">A few more finds</p><h2>You may also like.</h2></div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((item) => (
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
