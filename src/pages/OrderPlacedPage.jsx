import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectOrderById } from '../features/orders/ordersSlice'
import ProductImage from '../components/ProductImage'
import { formatCents } from '../utils/pricing'

const OrderPlacedPage = () => {
  const { orderId } = useParams()
  const order = useSelector((state) => selectOrderById(state, orderId))

  if (!order) {
    return (
      <main className="order-page">
        <h1>Order details unavailable</h1>
        <p>Order history is kept for this visit only.</p>
        <Link className="text-link" to="/">Back to the collection</Link>
      </main>
    )
  }

  return (
    <main className="order-page">
      <p className="section-kicker">Your order is in</p>
      <h1>Thanks for choosing well.</h1>
      <p className="order-page__intro">Your sample order has been placed. This demo does not collect payment or send anything for delivery.</p>
      <div className="order-confirmation">
        <div><span>Order ID</span><strong>{order.id}</strong></div>
        <div><span>Placed</span><strong>{new Date(order.placedAt).toLocaleString()}</strong></div>
        <div><span>Total</span><strong>{formatCents(order.pricing.totalCents)}</strong></div>
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
      <Link className="text-link" to="/">Continue browsing</Link>
    </main>
  )
}

export default OrderPlacedPage
