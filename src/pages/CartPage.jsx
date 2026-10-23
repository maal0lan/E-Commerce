import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import ProductImage from '../components/ProductImage'
import QtyStepper from '../components/QtyStepper'
import { clearCart, decrease, increase, removeFromCart } from '../features/cart/cartSlice'
import { selectCartDetails, selectTotalPrice } from '../features/cart/selectors'
import { getCouponRule } from '../features/coupons/couponRules'
import { applyCoupon, removeCoupon } from '../features/coupons/couponsSlice'
import { placeOrder } from '../features/orders/ordersSlice'
import { selectProductStatus } from '../features/products/selectors'
import formatPrice from '../utils/formatPrice'
import { calculatePricing, formatCents, validateCoupon } from '../utils/pricing'

const CartPage = ({ notify }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartDetails)
  const subtotalCents = useSelector(selectTotalPrice)
  const appliedCode = useSelector((state) => state.coupons.appliedCode)
  const couponNotice = useSelector((state) => state.coupons.notice)
  const productStatus = useSelector(selectProductStatus)
  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const pricing = useMemo(
    () => calculatePricing(subtotalCents, appliedCode),
    [appliedCode, subtotalCents],
  )
  const allProductsLoaded = items.every((item) => item.product)

  const applyCode = (event) => {
    event.preventDefault()
    const code = couponInput.trim().toUpperCase()
    const validation = validateCoupon(code, subtotalCents)

    if (!validation.valid) {
      setCouponMessage(validation.message)
      return
    }

    dispatch(applyCoupon(code))
    setCouponInput('')
    setCouponMessage(`${code} applied — ${getCouponRule(code).description}.`)
    notify('Coupon applied')
  }

  const submitOrder = () => {
    if (!items.length || !allProductsLoaded) return

    const orderId = `CG-${Date.now().toString(36).toUpperCase()}`
    const order = {
      id: orderId,
      placedAt: new Date().toISOString(),
      items: items.map(({ id, qty, priceCents, product }) => ({
        id,
        qty,
        title: product.title,
        image: product.image,
        priceCents,
      })),
      pricing,
      couponCode: appliedCode,
    }

    dispatch(placeOrder(order))
    dispatch(clearCart())
    dispatch(removeCoupon())
    navigate(`/orders/${orderId}`)
  }

  if (!items.length) {
    return (
      <main className="cart-page">
        <div className="cart-page__heading">
          <div><p className="section-kicker">Your selection</p><h1>Your bag</h1></div>
          <Link className="text-link" to="/">Continue shopping</Link>
        </div>
        <div className="cart-empty">
          <p>Your bag is taking a breather.</p>
          <Link className="text-link" to="/">Find something useful</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="cart-page__heading">
        <div><p className="section-kicker">Your selection</p><h1>Your bag</h1></div>
        <Link className="text-link" to="/">Continue shopping</Link>
      </div>
      {productStatus === 'loading' && !allProductsLoaded && (
        <p aria-live="polite" className="cart-loading">Loading the details for your bag...</p>
      )}
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ id, qty, priceCents, product }) => (
            <article className="cart-item" key={id}>
              <Link aria-label={`View ${product?.title || 'product'}`} className="cart-item__image-link" to={`/products/${id}`}>
                {product
                  ? <ProductImage
                    alt={product.title}
                    category={product.category}
                    className="cart-item__image"
                    src={product.image}
                  />
                  : <span className="cart-item__image cart-item__image--missing">Loading</span>}
              </Link>
              <div className="cart-item__details">
                <span className="cart-item__category">{product?.category || 'Product'}</span>
                <h2><Link to={`/products/${id}`}>{product?.title || `Product ${id}`}</Link></h2>
                <button className="cart-item__remove" onClick={() => dispatch(removeFromCart(id))} type="button">Remove</button>
              </div>
              <QtyStepper
                label={`Quantity for ${product?.title || 'product'}`}
                min={0}
                onChange={(quantity) => dispatch(quantity > qty ? increase(id) : decrease(id))}
                value={qty}
              />
              <strong className="cart-item__price">
                {formatPrice((priceCents * qty) / 100)}
              </strong>
            </article>
          ))}
        </div>

        <aside className="order-summary">
          <h2>Order summary</h2>
          <div><span>Subtotal</span><strong>{formatCents(pricing.subtotalCents)}</strong></div>
          <div className="order-summary__discount">
            <span>Discount{appliedCode ? ` (${appliedCode})` : ''}</span>
            <strong>{pricing.discountCents ? `−${formatCents(pricing.discountCents)}` : formatCents(0)}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{pricing.shippingCents ? formatCents(pricing.shippingCents) : 'Free'}</strong>
          </div>
          <div className="order-summary__total"><span>Total</span><strong>{formatCents(pricing.totalCents)}</strong></div>

          <form className="coupon-form" onSubmit={applyCode}>
            <label htmlFor="coupon-code">Coupon code</label>
            <div>
              <input
                autoComplete="off"
                id="coupon-code"
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="Enter code"
                value={couponInput}
              />
              <Button type="submit" variant="quiet">Apply</Button>
            </div>
            {appliedCode && (
              <button className="coupon-remove" onClick={() => {
                dispatch(removeCoupon())
                setCouponMessage('Coupon removed.')
              }} type="button">Remove {appliedCode}</button>
            )}
            {(couponMessage || pricing.couponMessage || couponNotice) && (
              <p aria-live="polite" className="coupon-message" role="status">
                {couponMessage || couponNotice || pricing.couponMessage}
              </p>
            )}
          </form>

          <Button
            className="order-summary__button"
            disabled={!allProductsLoaded}
            onClick={submitOrder}
          >
            Place order
          </Button>
          <p>This demo creates a sample order. No payment details are collected.</p>
        </aside>
      </div>
    </main>
  )
}

export default CartPage
