import Button from './Button'
import Card from './Card'
import Chip from './Chip'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import formatPrice from '../utils/formatPrice'

const ProductCard = ({ product, onAdd }) => (
  <Card className="product-card">
    <Link aria-label={`View ${product.title}`} className="product-card__image-wrap" to={`/products/${product.id}`}>
      <ProductImage
        alt={product.title}
        category={product.category}
        className="product-card__image"
        src={product.image}
      />
    </Link>
    <div className="product-card__details">
      <Chip>{product.category}</Chip>
      <h2><Link className="product-card__title" to={`/products/${product.id}`}>{product.title}</Link></h2>
      <div className="product-card__bottom">
        <span className="product-card__price">{formatPrice(product.price)}</span>
        <Button onClick={() => onAdd(product)} variant="quiet">Add to bag</Button>
      </div>
    </div>
  </Card>
)

export default ProductCard
