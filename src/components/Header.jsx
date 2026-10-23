import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { selectTheme, setTheme } from '../features/theme/themeSlice'
import { selectCartCount } from '../features/cart/selectors'
import './components.css'

const HeaderSearch = ({ query }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState(query)

  useEffect(() => {
    if (search.trim() === query) return undefined

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(location.search)
      if (search.trim()) params.set('q', search.trim())
      else params.delete('q')
      params.delete('page')
      const suffix = params.toString()
      const destination = { pathname: '/', search: suffix ? `?${suffix}` : '' }

      if (location.pathname === '/') navigate(destination, { replace: true })
      else if (search.trim()) navigate(destination)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [location.pathname, location.search, navigate, query, search])

  return (
    <label className="header-search">
      <span className="visually-hidden">Search products</span>
      <input
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search"
        type="search"
        value={search}
      />
    </label>
  )
}

const Header = () => {
  const cartCount = useSelector(selectCartCount)
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()
  const location = useLocation()
  const query = new URLSearchParams(location.search).get('q') || ''

  const cycleTheme = () => {
    const nextTheme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system'
    dispatch(setTheme(nextTheme))
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link aria-label="Common Goods home" className="wordmark" to="/">
          common goods<span>.</span>
        </Link>
        <nav aria-label="Main navigation" className="site-nav">
          <NavLink end to="/">Shop</NavLink>
          <NavLink to="/approach">Our approach</NavLink>
        </nav>
        <HeaderSearch key={query} query={query} />
        <button
          aria-label={`Theme is ${theme}. Change theme`}
          className="theme-toggle"
          onClick={cycleTheme}
          type="button"
        >
          Theme
        </button>
        <Link aria-label={`Shopping bag, ${cartCount} items`} className="header-cart" to="/cart">
          Bag <span className="header-cart__count">{cartCount}</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
