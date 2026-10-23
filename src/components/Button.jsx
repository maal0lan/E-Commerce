import './components.css'

const Button = ({
  children,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  variant = 'primary',
}) => (
  <button
    className={`button button--${variant} ${className}`.trim()}
    disabled={disabled}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
)

export default Button
