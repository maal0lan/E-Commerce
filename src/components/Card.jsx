import './components.css'

const Card = ({ children, className = '' }) => (
  <article className={`card ${className}`.trim()}>{children}</article>
)

export default Card
