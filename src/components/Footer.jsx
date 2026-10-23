import { Link } from 'react-router-dom'
import './components.css'

const Footer = () => (
  <footer className="site-footer" id="about">
    <div className="site-footer__inner">
      <Link className="site-footer__brand" to="/">
        <img alt="" className="wordmark__logo" src="/logo.png" />
        common goods.
      </Link>
      <p>Everyday essentials, chosen with care.</p>
      <Link className="site-footer__approach" to="/approach">Our approach</Link>
    </div>
  </footer>
)

export default Footer
