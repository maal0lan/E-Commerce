import './components.css'

const QtyStepper = ({ value, onChange, min = 1, label = 'Quantity' }) => (
  <div aria-label={label} className="qty-stepper" role="group">
    <button
      aria-label={`Decrease ${label.toLowerCase()}`}
      disabled={value <= min}
      onClick={() => onChange(Math.max(min, value - 1))}
      type="button"
    >
      −
    </button>
    <span aria-live="polite">{value}</span>
    <button
      aria-label={`Increase ${label.toLowerCase()}`}
      onClick={() => onChange(value + 1)}
      type="button"
    >
      +
    </button>
  </div>
)

export default QtyStepper
