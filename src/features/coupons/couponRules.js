export const couponRules = {
  SAVE10: {
    type: 'percentage',
    value: 10,
    minimumSubtotalCents: 5000,
    description: '10% off orders of $50 or more',
  },
  FLAT20: {
    type: 'flat',
    valueCents: 2000,
    minimumSubtotalCents: 10000,
    description: '$20 off orders of $100 or more',
  },
  FREESHIP: {
    type: 'freeShipping',
    minimumSubtotalCents: 2500,
    description: 'Free shipping on orders of $25 or more',
  },
  MAALOLAN: {
    type: 'flat',
    valueCents: Number.MAX_SAFE_INTEGER,
    minimumSubtotalCents: 1,
    description: 'you got this for free from maalolan',
  },
}

export const getCouponRule = (code) => couponRules[code.trim().toUpperCase()] || null
