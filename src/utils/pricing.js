import { getCouponRule } from '../features/coupons/couponRules.js'

export const SHIPPING_CENTS = 800
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000

export const validateCoupon = (code, subtotalCents, now = Date.now()) => {
  const rule = getCouponRule(code)

  if (!rule) return { valid: false, message: 'That coupon code isn’t recognized.' }
  if (rule.expiresAt && now > new Date(rule.expiresAt).getTime()) {
    return { valid: false, message: 'That coupon has expired.' }
  }
  if (subtotalCents < rule.minimumSubtotalCents) {
    const minimum = (rule.minimumSubtotalCents / 100).toFixed(2)
    return { valid: false, message: `Add ${formatCents(rule.minimumSubtotalCents - subtotalCents)} more to use this code (minimum $${minimum}).` }
  }

  return { valid: true, rule }
}

export const calculatePricing = (subtotalCents, couponCode = null, now = Date.now()) => {
  const subtotal = Math.max(0, Math.round(subtotalCents))
  const coupon = couponCode ? validateCoupon(couponCode, subtotal, now) : null
  const rule = coupon?.valid ? coupon.rule : null
  let discount = 0

  if (rule?.type === 'percentage') {
    discount = Math.round(subtotal * rule.value / 100)
  } else if (rule?.type === 'flat') {
    discount = Math.min(subtotal, rule.valueCents)
  }

  const discountedSubtotal = subtotal - discount
  const qualifiesForFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD_CENTS
  const isFreeShippingCoupon = rule?.type === 'freeShipping'
  const shipping = qualifiesForFreeShipping || isFreeShippingCoupon ? 0 : SHIPPING_CENTS

  return {
    subtotalCents: subtotal,
    discountCents: discount,
    shippingCents: shipping,
    totalCents: discountedSubtotal + shipping,
    discountedSubtotalCents: discountedSubtotal,
    couponValid: coupon?.valid ?? null,
    couponMessage: coupon && !coupon.valid ? coupon.message : null,
  }
}

export const formatCents = (cents) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(cents / 100)
