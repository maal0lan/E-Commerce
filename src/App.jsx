import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import { addItem, removeItem, setItemQuantity } from './features/cart/cartSlice'
import { selectCartItems, selectCartSubtotal } from './features/cart/selectors'
import products from '../curl-reposonse-dataset.json'
import formatPrice from './utils/formatPrice'
import Button from './components/Button'
import Footer from './components/Footer'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import QtyStepper from './components/QtyStepper'
import './App.css'

const HomePage = () => {
  const dispatch = useDispatch()
  const featuredProducts = products.slice(0, 8)

  return (
    <>
      <main>
        <section className="intro">
          <div className="intro__content">
            <p className="intro__eyebrow">A little more considered</p>
            <h1>Good things, chosen well.</h1>
            <p className="intro__summary">
              Everyday finds for the way you live, picked for quality, usefulness and lasting appeal.
            </p>
            <a className="intro__link" href="#shop">Explore the collection <span aria-hidden="true">↓</span></a>
          </div>
          <div aria-label="A selection of considered everyday goods" className="intro__visual">
            <img
              alt="A selection of everyday essentials"
              src={featuredProducts[0].image}
            />
            <div className="intro__caption">
              <span>Useful by nature</span>
              <span>Made for every day</span>
            </div>
          </div>
        </section>

        <section className="collection" id="shop">
          <div className="collection__heading">
            <div>
              <p className="section-kicker">The collection</p>
              <h2>Everyday, made better.</h2>
            </div>
            <p>Useful pieces. A fair price. Nothing extra.</p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                onAdd={(item) => dispatch(addItem(item))}
                product={product}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

const CartPage = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)

  return (
    <>
      <main className="cart-page">
        <div className="cart-page__heading">
          <div>
            <p className="section-kicker">Your selection</p>
            <h1>Your bag</h1>
          </div>
          <Link className="text-link" to="/">Continue shopping</Link>
        </div>
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your bag is taking a breather.</p>
            <Link className="text-link" to="/">Find something useful</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img alt={item.title} className="cart-item__image" src={item.image} />
                  <div className="cart-item__details">
                    <span className="cart-item__category">{item.category}</span>
                    <h2>{item.title}</h2>
                    <button
                      className="cart-item__remove"
                      onClick={() => dispatch(removeItem(item.id))}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <QtyStepper
                    label={`Quantity for ${item.title}`}
                    onChange={(quantity) => dispatch(setItemQuantity({ id: item.id, quantity }))}
                    value={item.quantity}
                  />
                  <strong className="cart-item__price">{formatPrice(item.price * item.quantity)}</strong>
                </article>
              ))}
            </div>
            <aside className="order-summary">
              <h2>Order summary</h2>
              <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <div><span>Shipping</span><span>Calculated at checkout</span></div>
              <div className="order-summary__total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div>
              <Button className="order-summary__button" disabled>Checkout coming soon</Button>
              <p>Shipping and taxes are calculated at checkout.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

const NotFoundPage = () => (
  <main className="not-found">
    <h1>That page wandered off.</h1>
    <Link className="text-link" to="/">Back to the collection</Link>
  </main>
)

const App = () => (
  <div className="app-shell">
    <Header />
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<CartPage />} path="/cart" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  </div>
)

export default App
