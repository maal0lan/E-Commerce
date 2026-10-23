import './components.css'

const ProductSkeleton = () => (
  <div aria-hidden="true" className="product-skeleton">
    <div className="product-skeleton__image" />
    <div className="product-skeleton__line" />
    <div className="product-skeleton__line product-skeleton__line--short" />
  </div>
)

export default ProductSkeleton
