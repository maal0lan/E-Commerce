import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../features/cart/selectors'
import './components.css'

const Header = () => {
  const cartCount = useSelector(selectCartCount)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link aria-label="Common Goods home" className="wordmark" to="/">
          common goods<span>.</span>
        </Link>
        <nav aria-label="Main navigation" className="site-nav">
          <NavLink end to="/">Shop</NavLink>
          <a href="/#about">Our approach</a>
        </nav>
        <Link aria-label={`Shopping bag, ${cartCount} items`} className="header-cart" to="/cart">
          Bag <span className="header-cart__count">{cartCount}</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
