import { Component } from 'react'
import Button from './Button'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError = () => ({ hasError: true })

  render() {
    if (this.state.hasError) {
      return (
        <main className="product-state">
          <div className="error-box" role="alert">
            <p>The shop hit an unexpected problem.</p>
            <Button onClick={() => window.location.reload()}>Reload the shop</Button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
