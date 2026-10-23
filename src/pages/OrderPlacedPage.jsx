import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectOrderById } from '../features/orders/ordersSlice'
import { selectAllProducts } from '../features/products/selectors'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import { formatCents } from '../utils/pricing'

const OrderPlacedPage = ({ notify }) => {
  const { orderId } = useParams()
  const order = useSelector((state) => selectOrderById(state, orderId))
  const products = useSelector(selectAllProducts)
  const dispatch = useDispatch()

  const downloadReceipt = () => {
    if (!order) return
    const lines = [
      'COMMON GOODS',
      'PURCHASE RECEIPT',
      '',
      `Invoice: ${order.invoiceId || order.id}`,
      `Order: ${order.id}`,
      `Customer: ${order.username || 'Guest'}`,
      `Date: ${new Date(order.placedAt).toLocaleString()}`,
      '',
      ...order.items.map((item) => `${item.title} x ${item.qty} — ${formatCents(item.priceCents * item.qty)}`),
      '',
      `Subtotal: ${formatCents(order.pricing.subtotalCents)}`,
      `Discount: −${formatCents(order.pricing.discountCents)}`,
      `Shipping: ${order.pricing.shippingCents ? formatCents(order.pricing.shippingCents) : 'Free'}`,
      `Total: ${formatCents(order.pricing.totalCents)}`,
      '',
      'Thank you for choosing well.',
    ]
    const receipt = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(receipt)
    const link = document.createElement('a')
    link.href = url
    link.download = `${order.invoiceId || order.id}-receipt.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const orderedIds = new Set(order?.items.map((item) => item.id) || [])
  const recommendations = products.filter((product) => !orderedIds.has(product.id)).slice(0, 4)

  const addProduct = (product) => {
    dispatch(addToCart({ id: product.id, qty: 1, priceCents: Math.round(product.price * 100) }))
    notify('Added to your bag')
  }

  if (!order) {
    return (
      <main className="order-page">
        <h1>Order details unavailable</h1>
        <p>Order history is kept for this visit only.</p>
        <Link className="text-link" to="/products">Back to the collection</Link>
      </main>
    )
  }

  return (
    <main className="order-page order-page--placed">
      <div className="order-page__main">
        <p className="section-kicker">Your order is in</p>
        <h1>Thanks for choosing well.</h1>
        <p className="order-page__intro">Your sample order has been placed. This demo does not collect payment or send anything for delivery.</p>
        <div className="order-confirmation">
          <div><span>Invoice</span><strong>{order.invoiceId || order.id}</strong></div>
          <div><span>Shopping as</span><strong>{order.username || 'Guest'}</strong></div>
          <div><span>Placed</span><strong>{new Date(order.placedAt).toLocaleString()}</strong></div>
          <div><span>Total</span><strong>{formatCents(order.pricing.totalCents)}</strong></div>
        </div>
        <div className="order-page__actions">
          <button className="button button--primary" onClick={downloadReceipt} type="button">Download receipt ↓</button>
          <Link className="text-link" to="/products">Continue browsing</Link>
        </div>
        <h2>In your order</h2>
        <ul className="order-page__items">
          {order.items.map((item) => (
            <li key={item.id}>
              <ProductImage alt="" category={item.title} src={item.image} />
              <span>{item.title} <strong>× {item.qty}</strong></span>
              <strong>{formatCents(item.priceCents * item.qty)}</strong>
            </li>
          ))}
        </ul>
      </div>
      {recommendations.length > 0 && (
        <aside className="order-recommendations">
          <p className="section-kicker">A few more finds</p>
          <h2>You may also like.</h2>
          <div className="order-recommendations__grid">
            {recommendations.map((product) => <ProductCard key={product.id} onAdd={addProduct} product={product} />)}
          </div>
        </aside>
      )}
    </main>
  )
}

export default OrderPlacedPage
