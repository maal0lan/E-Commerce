import assert from 'node:assert/strict'
import test from 'node:test'
import { calculatePricing, validateCoupon } from './pricing.js'

test('percentage discount is applied before free-shipping qualification', () => {
  assert.deepEqual(calculatePricing(10000, 'SAVE10'), {
    subtotalCents: 10000,
    discountCents: 1000,
    shippingCents: 800,
    totalCents: 9800,
    discountedSubtotalCents: 9000,
    couponValid: true,
    couponMessage: null,
  })
})

test('flat coupon caps discount at subtotal and shipping uses discounted total', () => {
  const pricing = calculatePricing(12000, 'FLAT20')

  assert.equal(pricing.discountCents, 2000)
  assert.equal(pricing.shippingCents, 0)
  assert.equal(pricing.totalCents, 10000)
})

test('free-shipping coupon removes shipping but does not discount items', () => {
  const pricing = calculatePricing(5000, 'FREESHIP')

  assert.equal(pricing.discountCents, 0)
  assert.equal(pricing.shippingCents, 0)
  assert.equal(pricing.totalCents, 5000)
})

test('coupon minimum and unknown codes return useful validation states', () => {
  assert.equal(validateCoupon('SAVE10', 4999).valid, false)
  assert.equal(validateCoupon('SAVE10', 5000).valid, true)
  assert.equal(validateCoupon('NOTREAL', 50000).valid, false)
})
