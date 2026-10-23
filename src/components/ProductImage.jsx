import { useState } from 'react'
import './components.css'

const ProductImage = ({ alt, category, className, src }) => {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span aria-label={`Image unavailable: ${alt}`} className={`${className} image-fallback`} role="img">
        {category}
      </span>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      src={src}
    />
  )
}

export default ProductImage
