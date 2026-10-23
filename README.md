# Common Goods

A responsive React storefront built with Vite, with API-backed product browsing, URL-synced search and filters, a persisted cart, coupon pricing, theme selection, and a sample order flow.

## Run locally

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm test` — run cart and pricing unit tests
- `npm run preview` — preview the production build

## Foundation

- React with React Router for the storefront and bag routes
- Redux Toolkit and React Redux for product, cart, coupon, theme, and order state
- Redux Persist stores only the cart, coupon, and theme selections in browser storage
- Product requests use `VITE_API_BASE_URL` when set, otherwise Fake Store API
- Reusable components live in `src/components/`
- Shared design tokens live in `src/styles/tokens.css`
- Coupons are defined in `src/features/coupons/couponRules.js`
- Pricing calculations use integer cents in `src/utils/pricing.js`

`Place order` creates an in-memory sample order for demonstration; it does not collect payment details or place a real order.
