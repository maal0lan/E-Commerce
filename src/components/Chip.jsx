import './components.css'

const Chip = ({ children, className = '' }) => (
  <span className={`chip ${className}`.trim()}>{children}</span>
)

export default Chip
