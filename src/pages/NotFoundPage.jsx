import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <main className="not-found">
    <h1>That page wandered off.</h1>
    <Link className="text-link" to="/products">Back to the collection</Link>
  </main>
)

export default NotFoundPage
