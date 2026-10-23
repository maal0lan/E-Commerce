import './components.css'

const Pagination = ({ page, pageCount, onPageChange }) => (
  <nav aria-label="Product pages" className="pagination">
    <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} type="button">Previous</button>
    <span aria-live="polite">Page {page} of {pageCount}</span>
    <button disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} type="button">Next</button>
  </nav>
)

export default Pagination
