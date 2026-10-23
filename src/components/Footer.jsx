import { Link } from 'react-router-dom'
import './components.css'

const Footer = () => (
  <footer className="site-footer" id="about">
    <div className="site-footer__inner">
      <Link className="site-footer__brand" to="/">common goods.</Link>
      <p>Everyday essentials, chosen with care.</p>
      <span>Thoughtful finds. Less fuss.</span>
    </div>
  </footer>
)

export default Footer
