const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com'
const REQUEST_TIMEOUT_MS = 10000

const request = async (path, signal) => {
  const controller = new AbortController()
  let timedOut = false
  const timeoutId = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)
  const abortRequest = () => controller.abort()

  signal.addEventListener('abort', abortRequest, { once: true })

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal })

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`)
      error.status = response.status
      throw error
    }

    return await response.json()
  } catch (error) {
    if (timedOut) {
      throw new Error('The request timed out. Please try again.', { cause: error })
    }

    if (signal.aborted) {
      throw error
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
    signal.removeEventListener('abort', abortRequest)
  }
}

export const fetchProductsRequest = async (signal) => {
  const products = await request('/products', signal)
  if (!Array.isArray(products)) throw new TypeError('The product response was invalid.')
  return products
}

export const fetchProductRequest = async (id, signal) => {
  const product = await request(`/products/${id}`, signal)
  if (!product || product.id === undefined) {
    const error = new Error('Product not found')
    error.status = 404
    throw error
  }

  return product
}

export const getFriendlyError = (error) => {
  if (error?.status === 404) return 'We couldn’t find that product.'
  if (error?.status >= 500) return 'The shop is having trouble right now. Please try again shortly.'
  if (error?.name === 'AbortError') return 'The request was cancelled.'
  if (error?.message?.includes('timed out')) return error.message
  if (error instanceof TypeError) return 'Unable to connect. Check your internet connection and try again.'
  return 'Something went wrong while loading the shop. Please try again.'
}
