import Button from './Button'
import Card from './Card'
import Chip from './Chip'
import formatPrice from '../utils/formatPrice'

const ProductCard = ({ product, onAdd }) => (
  <Card className="product-card">
    <div className="product-card__image-wrap">
      <img alt={product.title} className="product-card__image" loading="lazy" src={product.image} />
    </div>
    <div className="product-card__details">
      <Chip>{product.category}</Chip>
      <h2>{product.title}</h2>
      <div className="product-card__bottom">
        <span className="product-card__price">{formatPrice(product.price)}</span>
        <Button onClick={() => onAdd(product)} variant="quiet">Add to bag</Button>
      </div>
    </div>
  </Card>
)

export default ProductCard
